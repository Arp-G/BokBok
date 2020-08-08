defmodule BokBok.Search do
  import Ecto.Query
  alias BokBok.{Repo, Accounts.User, Accounts.UserProfile}

  def find_users(query) do
    from(u in User,
      left_join: up in UserProfile,
      on: up.user_id == u.id,
      or_where: ilike(u.username, ^("%" <> query <> "%")),
      or_where: ilike(up.name, ^("%" <> query <> "%"))
    )
    |> Repo.all()
    |> Repo.preload(:user_profile)
  end

  def find_contacts(phone_nos) do
    from(u in User, where: u.phone_number in ^phone_nos)
    |> Repo.all()
    |> Repo.preload(:user_profile)
  end

  def get_random_people() do
    max = Repo.aggregate(User, :count, :id)
    random_offset = :rand.uniform(max) - 1

    from(u in User, limit: 10, offset: ^random_offset)
    |> Repo.all()
    |> Repo.preload(:user_profile)
  end
end
