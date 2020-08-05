defmodule BokBokWeb.UserProfileView do
  use BokBokWeb, :view
  alias BokBok.Uploaders.Avatar

  def render("show.json", %{user_profile: user_profile}) do
    %{data: render_one(user_profile, __MODULE__, "user_profile.json")}
  end

  def render("user_profile.json", %{user_profile: user_profile}) do
    if user_profile do
      %{
        name: user_profile.name,
        avatar: render_image_url(user_profile),
        dob: user_profile.dob,
        bio: user_profile.bio,
        user_id: user_profile.user_id
      }
    else
      nil
    end
  end

  defp render_image_url(user_profile) do
    if user_profile.avatar do
      %{
        original: Avatar.url({user_profile.avatar, user_profile}, signed: true),
        thumbnail: Avatar.url({user_profile.avatar, user_profile}, :thumb, signed: true)
      }
    else
      nil
    end
  end
end
