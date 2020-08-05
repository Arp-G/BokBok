alias BokBok.{
  Repo,
  Accounts,
  Accounts.User,
  Accounts.UserProfile,
  Search,
  Conversations,
  UserCommunication,
  UserCommunication.UserConversation,
  UserCommunication.Chat,
  UserCommunication.Conversation
}

alias BokBokWeb.{MessageChannel, UserChannel}
import Ecto.Query

token = fn user_id ->
  Phoenix.Token.sign(
    Application.get_env(:bok_bok, BokBok.Repo)[:secret_key],
    Application.get_env(:bok_bok, BokBok.Repo)[:salt],
    user_id
  )
end

measure = fn function ->
  time =
    function
    |> :timer.tc()
    |> elem(0)
    |> Kernel./(1_000_000)

  "#{IO.ANSI.bright()} Operation took: #{time} seconds #{IO.ANSI.bright()}"
  |> IO.ANSI.format()
  |> IO.puts()
end
