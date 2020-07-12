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

  def handle_info(:after_join, socket) do
    push(socket, "presence_state", BokBokWeb.Presence.list(socket))

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
          assigns: %{user_id: sender_id, name: name},
          topic: conversation_id
        } = socket
      ) do
    conversation_id = String.replace_prefix(conversation_id, "conversation:", "")

    UC.create_new_message(sender_id, conversation_id, %{message: message})

    payload = %{
      time: DateTime.utc_now() |> DateTime.truncate(:millisecond),
      sender: name,
      body: message
    }

    broadcast!(socket, "new:msg", payload)

    {:noreply, socket}
  end

  def terminate(reason, _arg2) do
    IO.inspect("THE CHANNEL WAS LEFT ! DUE TO")
    IO.inspect(reason)
  end

  #   defp check_correct_user(%Phoenix.Socket{assigns: %{user_id: user_id}, topic: conversation_id}) do
  #     conversation_id = String.replace_prefix(conversation_id, "message:", "")

  #     [
  #       conversation
  #     ] = BokBok.Conversations.find_conversation(conversation_id) |> Enum.to_list()

  #     Enum.find(conversation["participants"], fn participant -> user_id == participant end)
  #   end
end
