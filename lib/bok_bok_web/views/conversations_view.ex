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
      created_by: conversation.user_id
    }
  end
end
