defmodule BokBokWeb.Helpers do
  def current_ip(conn) do
    conn.remote_ip |> :inet_parse.ntoa() |> to_string()
  end
end
