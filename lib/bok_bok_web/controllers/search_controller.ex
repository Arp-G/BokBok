defmodule BokBokWeb.SearchController do
  use BokBokWeb, :controller
  action_fallback BokBokWeb.FallbackController
  alias BokBok.Search

  def search(%{assigns: %{current_user: current_user}} = conn, %{"query" => query}) do
    search_results = Search.find_users(query, current_user)
    render(conn, "show.json", searches: search_results)
  end

  def search_contacts(%{assigns: %{current_user: current_user}} = conn, %{
        "phone_nos" => phone_nos
      }) do
    phone_nos =
      phone_nos
      |> Enum.reject(&is_nil/1)
      |> Enum.map(fn ph ->
        ph |> String.replace(["(", ")", "-", " ", "+"], "")
      end)

    search_results = Search.find_contacts(phone_nos, current_user)
    render(conn, "show.json", searches: search_results)
  end

  def random_users(%{assigns: %{current_user: current_user}} = conn, _) do
    search_results = Search.get_random_people(current_user)
    render(conn, "show.json", searches: search_results)
  end
end
