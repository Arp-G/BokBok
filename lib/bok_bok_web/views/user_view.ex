defmodule BokBokWeb.UserView do
  use BokBokWeb, :view
  alias BokBokWeb.UserView

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      username: user.username,
      phone_number: user.phone_number
    }
  end

  def render("token.json", %{token: token, id: id}) do
    %{
      id: id,
      token: token
    }
  end
end
