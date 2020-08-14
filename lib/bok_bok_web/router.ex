defmodule BokBokWeb.Router do
  use BokBokWeb, :router

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
