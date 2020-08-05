defmodule BokBokWeb.SearchView do
  use BokBokWeb, :view
  alias BokBok.Uploaders.Avatar

  def render("show.json", %{searches: searches}) do
    %{data: render_many(searches, __MODULE__, "search.json")}
  end

  def render("search.json", %{search: %{id: id, username: username, user_profile: user_profile}}) do
    %{
      id: id,
      username: username,
      user_profile:
        if(user_profile,
          do: %{
            name: user_profile.name,
            avatar: render_image_url(user_profile),
            dob: user_profile.dob,
            bio: user_profile.bio,
            user_id: user_profile.user_id
          },
          else: nil
        )
    }
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
