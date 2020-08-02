defmodule BokBok.Repo.Migrations.UpdateUserConversationsTable do
  use Ecto.Migration

  def change do
    alter table(:user_conversations) do
      add :receiver_id, references(:users)
      add :last_message, :string
      add :last_sender_id, references(:users)
      add :unseen_message_count, :integer, default: 0
    end
  end
end
