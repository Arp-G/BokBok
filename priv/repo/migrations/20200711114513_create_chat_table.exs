defmodule BokBok.Repo.Migrations.CreateChatTable do
  use Ecto.Migration

  def change do
    create table(:chats) do
      add :user_id, references(:users), null: false
      add :conversation_id, references(:conversations, on_delete: :delete_all), null: false
      add :message, :string
      add :file, :string
      timestamps()
    end
  end
end
