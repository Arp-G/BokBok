defmodule BokBokWeb.MessageChannel do
  use BokBokWeb, :channel
  alias BokBok.UserCommunication, as: UC

  def join(
        "conversation:" <> conversation_id,
        _payload,
        %Phoenix.Socket{assigns: %{user_id: user_id}} = socket
      ) do
    if UC.correct_user?(user_id, conversation_id) do
      send(self(), :after_join)

      messages = UC.get_conversation_messages(conversation_id)

      {
        :ok,
        %{msg: "Connected to topic conversation:#{conversation_id}", messages: messages},
        socket
      }
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(
        :after_join,
        %Phoenix.Socket{
          assigns: %{user_id: user_id},
          topic: "conversation:" <> conv_id
        } = socket
      ) do
    push(socket, "presence_state", BokBokWeb.Presence.list(socket))

    Task.start(UC, :reset_unseen_message, [
      user_id,
      conv_id
    ])

    participants = UC.list_participants_for_conversation(conv_id)

    socket = Phoenix.Socket.assign(socket, participants: participants)

    {:ok, _} =
      BokBokWeb.Presence.track(
        socket,
        socket.assigns.user_id,
        %{device: "browser"}
      )

    {:noreply, socket}
  end

  def handle_in(
        "new:msg",
        %{"body" => message},
        %Phoenix.Socket{
          assigns: %{user_id: sender_id, name: name, participants: participants},
          topic: "conversation:" <> conv_id
        } = socket
      ) do
    # {id: 1, message: "hio", name: "newuser", time: "2020-08-01T21:18:10Z"}
    {:ok, %BokBok.UserCommunication.Chat{id: id, inserted_at: time}} =
      UC.create_new_message(sender_id, conv_id, %{message: message})

    payload = %{
      id: id,
      name: name,
      message: message,
      time: time
    }

    broadcast!(socket, "new:msg", payload)

    [user_1, user_2] = participants

    receiver_id = if sender_id == user_1, do: user_2, else: user_1

    Task.start(__MODULE__, :update_unread_message_count, [
      receiver_id,
      conv_id,
      sender_id,
      name,
      message
    ])

    {:noreply, socket}
  end

  def update_unread_message_count(receiver_id, conv_id, sender_id, sender_name, message) do
    active_participants = BokBokWeb.Presence.list("conversation:#{conv_id}")

    # check if receiver is online
    unless active_participants[Integer.to_string(receiver_id)] do
      UC.update_unseen_message(
        receiver_id,
        conv_id,
        sender_id,
        message
      )

      BokBokWeb.Endpoint.broadcast("user:#{receiver_id}", "update_unread", %{
        conversation_id: conv_id,
        last_message: message,
        last_sender: sender_name
      })
    end
  end

  def terminate(reason, _arg2) do
    IO.inspect("THE MESSAGE CHANNEL WAS LEFT ! DUE TO")
    IO.inspect(reason)
  end
end
