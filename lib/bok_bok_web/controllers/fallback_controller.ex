defmodule BokBokWeb.FallbackController do
  use BokBokWeb, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(BokBokWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(BokBokWeb.ErrorView)
    |> render(:"404")
  end

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(BokBokWeb.ErrorView)
    |> render(:"Login error")
  end

  def call(conn, {:error, %{code: code, message: message}}) do
    conn
    |> put_status(code)
    |> put_view(BokBokWeb.ErrorView)
    |> render("error.json", %{code: code, message: message})
  end

  def call(conn, {:error, reason}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(BokBokWeb.ErrorView)
    |> json(%{error: reason})
  end
end
