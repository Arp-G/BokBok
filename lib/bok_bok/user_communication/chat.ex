defmodule BokBok.UserCommunication.Chat do
  use Ecto.Schema
  @timestamps_opts [type: :utc_datetime]
  import Ecto.Changeset
  alias BokBok.Accounts.User

  schema "chats" do
    field :message, :string
    # field :file, :string

    belongs_to :user, User, foreign_key: :user_id
    belongs_to :conversations, User, foreign_key: :conversation_id

    timestamps()
  end

  def changeset(attrs) do
    %__MODULE__{}
    |> cast(attrs, [
      :message,
      :user_id,
      :conversation_id
    ])
    |> assoc_constraint(:user)
    |> assoc_constraint(:conversations)
  end
end
