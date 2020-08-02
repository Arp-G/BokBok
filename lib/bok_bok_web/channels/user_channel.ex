defmodule BokBokWeb.UserChannel do
  use BokBokWeb, :channel
  alias BokBok.UserCommunication, as: UC

  def join(
        "user:" <> topic,
        _payload,
        %Phoenix.Socket{assigns: %{user_id: user_id}} = socket
      ) do
    if Integer.to_string(user_id) == topic,
      do: {:ok, %{msg: "Connected to topic user:#{user_id}"}, socket},
      else: {:error, %{reason: "unauthorized"}}
  end

  def handle_in(
        "fetch_conversaions",
        _payload,
        %Phoenix.Socket{assigns: %{user_id: user_id}} = socket
      ) do
    conversations = UC.get_users_conversations(user_id)
    {:reply, {:ok, %{conversations: conversations}}, socket}
  end

  def terminate(reason, _arg2) do
    IO.inspect("THE CHANNEL WAS LEFT ! DUE TO")
    IO.inspect(reason)
  end
end
