defmodule BokBok.Repo.Migrations.CreateUsersTable do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION citext"

    create table(:users) do
      add :username, :citext, null: false
      add :password_hash, :string, null: false
      add :phone_number, :string, null: false
      add :role, :string, default: "guest", null: false
      add :last_sign_in_at, :utc_datetime_usec
      add :last_sign_in_ip, :string

      timestamps()
    end

    create unique_index(:users, [:username])
    create unique_index(:users, [:phone_number])
  end
end
