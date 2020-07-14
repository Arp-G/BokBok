defmodule BokBok.Repo.Migrations.CreateConversationsTable do
  use Ecto.Migration

  def change do
    ConversationTypeEnum.create_type()

    create table(:conversations) do
      add :name, :string
      add :user_id, references(:users), null: false
      add :type, ConversationTypeEnum.type()
      timestamps()
    end
  end
end
