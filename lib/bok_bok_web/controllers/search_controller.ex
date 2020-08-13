defmodule BokBokWeb.SearchController do
  use BokBokWeb, :controller
  action_fallback BokBokWeb.FallbackController
  alias BokBok.Search

  def search(conn, %{"query" => query}) do
    search_results = Search.find_users(query)
    render(conn, "show.json", searches: search_results)
  end

  def search_contacts(conn, params) do
    phone_nos =
      case params do
        %{"phone_nos" => phone_nos} ->
          x = phone_nos |> Enum.map(fn ph -> ph |> String.replace(["(", ")", "-", " "], "") end)
          IO.inspect(x)
          x

        _ ->
          []
      end

    search_results = Search.find_contacts(phone_nos)
    render(conn, "show.json", searches: search_results)
  end

  def random_users(conn, _) do
    search_results = Search.get_random_people()
    render(conn, "show.json", searches: search_results)
  end
end
