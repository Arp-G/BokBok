# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
use Mix.Config

database_url =
  System.get_env("DATABASE_URL") ||
    raise """
    environment variable DATABASE_URL is missing.
    For example: ecto://USER:PASS@HOST/DATABASE
    """

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :bok_bok, BokBok.Repo,
  ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
  secret_key: secret_key_base,
  salt: System.get_env("SALT")

config :bok_bok, BokBokWeb.Endpoint,
  http: [:inet6, port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: secret_key_base

config :arc,
  hash_secret: System.get_env("ARC_HASH_SECRET"),
  storage: Arc.Storage.S3,
  bucket: "bokbok"

config :ex_aws,
  region: System.get_env("AWS_REGION"),
  access_key_id: System.get_env("AWS_ACCESS_KEY"),
  secret_access_key: System.get_env("AWS_SECRET_ACCESS_KEY")

config :bok_bok, BokBok.FCM, firebase_url: "https://bokbok-885c0.firebaseio.com/"

config :pigeon, :fcm, fcm_default: %{key: System.get_env("FCM_KEY")}
