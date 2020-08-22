defmodule BokBok.Accounts.User do
  use Ecto.Schema
  @timestamps_opts [type: :utc_datetime]
  import Ecto.Changeset

  alias BokBok.{Helpers.ChangesetHelpers, Helpers.CustomValidations}
  alias BokBok.UserCommunication

  schema "users" do
    field :username, :string, null: false
    field :email, :string, null: false
    field :password_hash, :string, null: false
    field :phone_number, :string, null: false
    field :role, :string, default: "guest", null: false
    field :last_sign_in_at, :utc_datetime_usec
    field :last_sign_in_ip, :string

    field :password, :string, virtual: true

    has_one :user_profile, BokBok.Accounts.UserProfile

    many_to_many :conversations, UserCommunication.Conversation,
      join_through: "user_conversations"

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [
      :username,
      :email,
      :password,
      :phone_number
    ])
    |> validate_required([:username, :email, :password, :phone_number])
    |> validate_length(:password, min: 5)
    |> validate_format(:email, ~r/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i)
    |> validate_change(:phone_number, &CustomValidations.validate_phone_number/2)
    |> update_change(:username, &String.downcase/1)
    |> unique_constraint(:username)
    |> unique_constraint(:email)
    |> unique_constraint(:phone_number)
    |> ChangesetHelpers.put_password_hash()
  end

  def password_chageset(user, attrs) do
    user
    |> cast(attrs, [:password])
    |> validate_required([:password])
    |> ChangesetHelpers.put_password_hash()
  end

  def signin_details_changeset(user, attrs) do
    user
    |> cast(attrs, [:last_sign_in_ip])
    |> put_change(:last_sign_in_at, DateTime.utc_now())
  end
end
