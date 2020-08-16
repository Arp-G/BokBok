defmodule BokBokWeb.SearchController do
  use BokBokWeb, :controller
  action_fallback BokBokWeb.FallbackController
  alias BokBok.Search

  def search(conn, %{"query" => query}) do
    search_results = Search.find_users(query)
    render(conn, "show.json", searches: search_results)
  end

  def search_contacts(conn, %{"phone_nos" => phone_nos}) do
    phone_nos =
      phone_nos
      |> Enum.reject(&is_nil/1)
      |> Enum.map(fn ph ->
        ph |> String.replace(["(", ")", "-", " ", "+"], "")
      end)

    search_results = Search.find_contacts(phone_nos)
    render(conn, "show.json", searches: search_results)
  end

  def random_users(conn, _) do
    search_results = Search.get_random_people()
    render(conn, "show.json", searches: search_results)
  end
end
