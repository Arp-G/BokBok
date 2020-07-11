use Mix.Config

# Configure your database
config :bok_bok, BokBok.Repo,
  username: "postgres",
  password: "postgres",
  database: "bok_bok_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :bok_bok, BokBokWeb.Endpoint,
  http: [port: 4002],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn
