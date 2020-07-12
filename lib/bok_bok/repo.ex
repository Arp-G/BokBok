defmodule BokBok.Repo do
  use Ecto.Repo,
    otp_app: :bok_bok,
    adapter: Ecto.Adapters.Postgres,
    migration_timestamps: [type: :utc_datetime]
end
