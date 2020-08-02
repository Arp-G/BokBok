defmodule BokBokWeb.UserSocket do
  use Phoenix.Socket
  alias BokBok.Accounts.User

  channel "user:*", BokBokWeb.UserChannel
  channel "conversation:*", BokBokWeb.MessageChannel

  def connect(%{"token" => token}, socket, _connect_info) do
    case Phoenix.Token.verify(
           Application.get_env(:bok_bok, BokBok.Repo)[:secret_key],
           Application.get_env(:bok_bok, BokBok.Repo)[:salt],
           token,
           max_age: :infinity
         ) do
      {:ok, user_id} ->
        user_id
        |> BokBok.Accounts.get_user()
        |> case do
          %User{} = user ->
            user = BokBok.Repo.preload(user, :user_profile)

            name = if user.user_profile, do: user.user_profile.name, else: user.username

            {:ok, assign(socket, user_id: user.id, name: name)}

          _ ->
            :error
        end

      {:error, _reason} ->
        :error
    end
  end

  def connect(_params, _socket, _connect_info), do: :error

  # lets us identify the socket based on some state stored in the socket itself
  def id(socket), do: "users_socket:#{socket.assigns.user_id}"
end
