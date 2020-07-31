defmodule BokBokWeb.UserChannel do
  use BokBokWeb, :channel
  alias BokBok.UserCommunication, as: UC

  def join(
        "user:" <> user_id,
        _payload,
        %Phoenix.Socket{assigns: %{user_id: user_id}} = socket
      ) do

    conversations = UC.get_users_conversations(user_id)

    {
      :ok,
      %{msg: "Connected to topic user:#{user_id}", conversations: conversations},
      socket
    }
  end

  def terminate(reason, _arg2) do
    IO.inspect("THE CHANNEL WAS LEFT ! DUE TO")
    IO.inspect(reason)
  end
end
