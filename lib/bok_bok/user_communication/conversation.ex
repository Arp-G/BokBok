defmodule BokBok.UserCommunication.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  alias BokBok.Accounts.User
  alias BokBok.UserCommunication.{Conversation, Chat}

  schema "conversations" do
    field :name, :string
    field :type, ConversationTypeEnum, default: :private

    belongs_to :user, User, foreign_key: :user_id

    many_to_many :users, Conversation, join_through: "user_conversations"
    has_many :chats, Chat, foreign_key: :conversation_id

    timestamps()
  end

  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:name, :type, :user_id])
    |> assoc_constraint(:user)
  end
end
