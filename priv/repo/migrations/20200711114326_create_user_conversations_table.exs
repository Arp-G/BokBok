defmodule BokBok.Repo.Migrations.CreateUserConversationsTable do
  use Ecto.Migration

  def change do
    create table(:user_conversations) do
      add :user_id, references(:users), null: false
      add :conversation_id, references(:conversations, on_delete: :delete_all), null: false
      timestamps()
    end
  end
end
