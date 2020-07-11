defmodule BokBokWeb.UserProfileController do
  use BokBokWeb, :controller

  alias BokBok.{Accounts, Accounts.UserProfile, NearbyUserProfiles}

  action_fallback BokBokWeb.FallbackController

  def create_or_update(%{assigns: %{current_user: current_user}} = conn, user_profile_params) do
    with {:ok, %UserProfile{} = user_profile} <-
           Accounts.create_or_update_user_profile(current_user.id, user_profile_params) do
      conn
      |> put_status(:created)
      |> render("show.json", user_profile: user_profile)
    end
  end

  def show(%{assigns: %{current_user: current_user}} = conn, _params) do
    user_profile = Accounts.get_user_profile_with_user_id!(current_user.id)
    render(conn, "show.json", user_profile: user_profile)
  end
end
