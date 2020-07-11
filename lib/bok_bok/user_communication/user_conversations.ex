defmodule BokBok.UserCommunication.UserConversation do
  use Ecto.Schema
  import Ecto.Changeset
  alias BokBok.{Accounts, UserCommunication}

  schema "user_conversations" do
    belongs_to :user, Accounts.User, foreign_key: :user_id
    belongs_to :conversation, UserCommunication.Conversation, foreign_key: :conversation_id
    timestamps()
  end

  def changeset(user_conversation, attrs) do
    user_conversation
    |> cast(attrs, [
      :user_id,
      :conversation_id
    ])
    |> assoc_constraint(:user)
    |> assoc_constraint(:conversation)
  end
end
