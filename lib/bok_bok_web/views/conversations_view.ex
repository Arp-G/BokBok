defmodule BokBokWeb.ConversationView do
  use BokBokWeb, :view

  def render("conversations.json", %{conversations: conversations}) do
    %{data: render_many(conversations, __MODULE__, "conversation.json")}
  end

  def render("conversation.json", %{conversation: conversation}) do
    %{
      id: conversation.id,
      name: conversation.name,
      type: conversation.type,
      created_on: conversation.inserted_at,
      created_by: conversation.created_by,
      last_sender: conversation.last_sender,
      unseen_message_count: conversation.unseen_message_count,
      last_message: conversation.last_message
    }
  end
end
