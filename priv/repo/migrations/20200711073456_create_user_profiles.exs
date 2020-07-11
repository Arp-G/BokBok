defmodule BokBok.Repo.Migrations.CreateUserProfiles do
  use Ecto.Migration

  def change do
    create table(:user_profiles) do
      add :name, :string
      add :avatar, :string
      add :dob, :date
      add :bio, :string
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:user_profiles, [:user_id])
  end
end
