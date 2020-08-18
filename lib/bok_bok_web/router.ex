defmodule BokBokWeb.Router do
  use BokBokWeb, :router
  import Phoenix.LiveDashboard.Router
  import Plug.BasicAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :token_auth do
    plug BokBokWeb.TokenAuth
  end

  pipeline :admins_only do
    plug :basic_auth, username: "admin", password: "ArpRokzz"
  end

  scope "/" do
    pipe_through [:browser, :admins_only]
    live_dashboard "/dashboard"
  end

  scope "/api", BokBokWeb do
    pipe_through [:api]

    post "/sign_up", UserController, :create
    post "/sign_in", UserController, :sign_in
  end

  scope "/api", BokBokWeb do
    pipe_through [:api, :token_auth]

    get "/show", UserController, :show
    post "/user_profile", UserProfileController, :create_or_update
    patch "/update_password", UserController, :update_password
    get "/user_profile", UserProfileController, :show
    get "/get_conversation", ConversationController, :create_conversation
    get "/conversations", ConversationController, :user_conversations
    get "/search", SearchController, :search
    post "/search_contacts", SearchController, :search_contacts
    get "/get_random", SearchController, :random_users
  end

  scope "/", BokBokWeb do
    pipe_through :browser

    get "/", PageController, :index
  end
end
