defmodule BokBok.UserCommunication.Chat do
  use Ecto.Schema
  import Ecto.Changeset

  schema "chat" do
    field :message, :string
    # field :file, :string

    belongs_to :user, Accounts.User, foreign_key: :user_id
    belongs_to :conversations, Accounts.User, foreign_key: :conversation_id

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
    |> assoc_constraint(:conversation)
  end
end
