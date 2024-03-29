defmodule BokBokWeb.TokenAuth do
  use BokBokWeb, :controller

  def init(opts), do: opts

  def call(conn, _opts) do
    conn
    |> current_resource()
    |> case do
      {:ok, user_id} ->
        user = BokBok.Accounts.get_user(user_id)
        assign(conn, :current_user, user)

      {:error, _} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Unauthorized"})
        |> halt()
    end
  end

  defp current_resource(conn) do
    token =
      conn
      |> get_req_header("authorization")
      |> get_token()
      |> String.replace_leading("Bearer ", "")

    Phoenix.Token.verify(
      Application.get_env(:bok_bok, BokBok.Repo)[:secret_key],
      Application.get_env(:bok_bok, BokBok.Repo)[:salt],
      token,
      max_age: :infinity
    )
  end

  defp get_token([token]), do: token
  defp get_token([]), do: ""
end
