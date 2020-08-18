defmodule BokBokWeb.ConversationController do
  use BokBokWeb, :controller

  alias BokBok.{UserCommunication, UserCommunication.Conversation}

  action_fallback BokBokWeb.FallbackController

  def user_conversations(%{assigns: %{current_user: user}} = conn, _) do
    conversations = UserCommunication.get_users_conversations(user.id)
    render(conn, "conversations.json", conversations: conversations)
  end

  def create_conversation(%{assigns: %{current_user: user}} = conn, %{
        "receiver_id" => receiver_id
      }) do
    with %Conversation{id: id} <-
           UserCommunication.create_or_get_private_conversation(user.id, receiver_id) do
      json(conn, %{conversation_id: id})
    end
  end
end
