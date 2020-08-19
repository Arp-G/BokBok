alias BokBok.Repo

# Number of users to seed
Faker.start()
user_count = 50

password_hash = Argon2.hash_pwd_salt("12345678aB")

1..user_count
|> Enum.each(fn _ ->
  fakeusername = "#{Faker.Internet.user_name()}#{System.unique_integer([:positive])}"

  user = %BokBok.Accounts.User{
    username: fakeusername,
    email: "#{fakeusername}@email.com",
    phone_number:
      System.unique_integer([:positive])
      |> Integer.to_string()
      |> String.pad_trailing(10, "0"),

    # hard code password hash to speed up seeding
    password_hash: password_hash
  }

  user = Repo.insert!(user)

  %BokBok.Accounts.UserProfile{
    name: "#{Faker.Person.first_name()} #{Faker.Person.last_name()}",
    dob: Faker.Date.date_of_birth(18..99),
    bio: Faker.Lorem.sentence(),
    user_id: user.id
  }
  |> Repo.insert!()
end)

users = Repo.all(BokBok.Accounts.User)

users
|> Enum.each(fn user ->
  n = :rand.uniform(20)

  Enum.reject(users, fn u -> u.id == user.id end)
  |> Enum.take_random(n)
  |> Enum.each(fn receiver ->
    conversation =
      BokBok.UserCommunication.create_or_get_private_conversation(user.id, receiver.id)

    n = :rand.uniform(30)

    1..n
    |> Enum.each(fn _ ->
      BokBok.UserCommunication.create_new_message(user.id, conversation.id, %{
        message: Faker.Lorem.sentence()
      })
    end)
  end)
end)
