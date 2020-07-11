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
  end

  scope "/", BokBokWeb do
    pipe_through :browser

    get "/", PageController, :index
  end
end
