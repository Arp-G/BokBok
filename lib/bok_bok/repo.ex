defmodule BokBok.Repo do
  use Ecto.Repo,
    otp_app: :bok_bok,
    adapter: Ecto.Adapters.Postgres
end
