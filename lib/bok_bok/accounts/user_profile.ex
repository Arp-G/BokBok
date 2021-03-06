defmodule BokBok.Accounts.UserProfile do
  use Ecto.Schema
  use Arc.Ecto.Schema
  @timestamps_opts [type: :utc_datetime]

  import Ecto.Changeset

  alias BokBok.{Accounts, Uploaders.Avatar, Helpers.CustomValidations}

  schema "user_profiles" do
    field :name, :string
    field :avatar, Avatar.Type
    field :dob, :date
    field :bio, :string

    belongs_to :user, Accounts.User, foreign_key: :user_id

    timestamps()
  end

  def changeset(user_profile, attrs) do
    user_profile
    |> cast(attrs, [
      :name,
      :dob,
      :bio,
      :user_id
    ])
    |> validate_required([:name, :dob])
    |> assoc_constraint(:user)
    |> validate_change(:dob, &CustomValidations.validate_date_not_in_the_future/2)
    |> unique_constraint(:user_id)
  end

  @dialyzer :no_match
  def avatar_changeset(user_profile, attrs) do
    case attrs["avatar"] do
      "" ->
        avatar = if user_profile.avatar, do: user_profile.avatar.file_name, else: ""

        with :ok <- Avatar.delete({avatar, user_profile}) do
          user_profile |> cast(attrs, [:avatar])
        end

      _ ->
        cast_attachments(user_profile, attrs, [:avatar])
    end
  end
end
