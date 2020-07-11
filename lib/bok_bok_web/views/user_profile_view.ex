defmodule BokBokWeb.UserProfileView do
  use BokBokWeb, :view
  # alias BokBok.Uploaders.Avatar

  def render("show.json", %{user_profile: user_profile}) do
    %{data: render_one(user_profile, __MODULE__, "user_profile.json")}
  end

  def render("user_profile.json", %{user_profile: user_profile}) do
    %{
      name: user_profile.name,
      # avatar: render_image_url(user_profile),
      dob: user_profile.dob,
      bio: user_profile.bio,
      user_id: user_profile.user_id
    }
  end
end
