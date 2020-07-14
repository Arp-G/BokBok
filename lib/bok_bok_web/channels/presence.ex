defmodule BokBokWeb.Presence do
    use Phoenix.Presence,
      otp_app: :bok_bok,
      pubsub_server: BokBok.PubSub
  end