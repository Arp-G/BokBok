defmodule BokBok.UserCommunication.UserConversation do
  use Ecto.Schema
  @timestamps_opts [type: :utc_datetime]
  import Ecto.Changeset
  alias BokBok.{Accounts, UserCommunication}

  schema "user_conversations" do
    field :last_message, :string
    field :unseen_message_count, :integer, default: 0

    belongs_to :last_sender, Accounts.User, foreign_key: :last_sender_id
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
