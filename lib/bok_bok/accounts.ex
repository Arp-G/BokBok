defmodule BokBok.Accounts do
  import Ecto.Query, warn: false

  alias Ecto.{Multi}

  alias BokBok.{
    Repo,
    Accounts.User
  }

  def list_users do
    Repo.all(User)
  end

  def list_users_with_ids(ids) do
    from(u in User, where: u.id in ^ids)
    |> Repo.all()
  end

  def get_user(id), do: Repo.get(User, id)

  def get_user!(id), do: Repo.get!(User, id)

  def create_user(attrs \\ %{}) do
    Multi.new()
    |> Multi.insert(:user, User.changeset(%User{}, attrs))
    |> Repo.transaction()
    |> case do
      {:ok, %{user: user}} ->
        {:ok, user}

      {:error, _, changeset, _} ->
        {:error, changeset}
    end
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def token_sign_in(last_sign_in_ip, username, password) do
    case username_password_auth(username, password) do
      {:ok, user} ->
        update_user_signin_details(user, %{last_sign_in_ip: last_sign_in_ip})

        {:ok,
         Phoenix.Token.sign(
           Application.get_env(:bok_bok, BokBok.Repo)[:secret_key],
           Application.get_env(:bok_bok, BokBok.Repo)[:salt],
           user.id
         ), user.username, user.id}

      _ ->
        {:error, :unauthorized}
    end
  end

  defp update_user_signin_details(%User{} = user, attrs) do
    user
    |> User.signin_details_changeset(attrs)
    |> Repo.update()
  end

  defp username_password_auth(username, password) do
    with {:ok, user} <- get_by_username(username),
         do: verify_password(password, user)
  end

  defp get_by_username(username) do
    case Repo.get_by(User, username: username) do
      nil ->
        Argon2.no_user_verify()
        {:error, "Login error."}

      user ->
        {:ok, user}
    end
  end

  defp verify_password(password, %User{} = user) when is_binary(password) do
    if Argon2.verify_pass(password, user.password_hash) do
      {:ok, user}
    else
      {:error, :invalid_password}
    end
  end
end
