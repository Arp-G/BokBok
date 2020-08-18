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

config :bok_bok, BokBok.Repo,
  ssl: true,
  url: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :bok_bok, BokBokWeb.Endpoint,
  http: [:inet6, port: String.to_integer(System.get_env("PORT") || "4000")],
  secret_key_base: secret_key_base

config :arc,
  hash_secret: "kWo0m97A3DPHxPwkDqoIqhoBXFgq5ZQW",
  storage: Arc.Storage.S3,
  bucket: "bokbok"

config :ex_aws,
  region: "ap-south-1",
  access_key_id: "AKIAQLZXPQNO7XIKB4N7",
  secret_access_key: "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"

config :bok_bok, BokBok.FCM, firebase_url: "https://bokbok-885c0.firebaseio.com/"

config :pigeon, :fcm,
  fcm_default: %{
    key:
      "AAAArcBKNfw:APA91bFgYawa_mkZ0vFx4bQm5JRA7F1ZYqzVj_6_MsHPFJ8lgRD9BszBZFmSFu7269G0U7L2i91OhDjCzcc-gLDxOd1zZedUa3HfaHYBRyq1R2JZn8uX9Iq_o4MqXpAp12lgR23qHA_F"
  }
