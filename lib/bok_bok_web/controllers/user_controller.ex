defmodule BokBokWeb.UserController do
  use BokBokWeb, :controller
  import BokBokWeb.Helpers

  alias BokBok.{Accounts, Accounts.User}

  action_fallback BokBokWeb.FallbackController

  def sign_in(conn, %{"username" => username, "password" => password}) do
    case Accounts.token_sign_in(current_ip(conn), username, password) do
      {:ok, token, username, id} ->
        render(conn, "token.json", token: token, username: username, id: id)

      _ ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Not Found"})
    end
  end

  def create(conn, attrs) do
    with {:ok, %User{} = user} <- Accounts.create_user(attrs) do
      {:ok, token, username, id} =
        Accounts.token_sign_in(current_ip(conn), attrs["username"], attrs["password"])

      render(conn, "token.json", token: token, username: username, id: id)
    end
  end

  def show(%{assigns: %{current_user: current_user}} = conn, _params) do
    render(conn, "user.json", user: current_user)
  end
end
