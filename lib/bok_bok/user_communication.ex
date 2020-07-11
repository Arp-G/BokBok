defmodule BokBok.UserCommunication do
  alias BokBok.Repo
  alias BokBok.UserCommunication.{Chat, Conversation, UserConversation}
  import Ecto.Query
  alias Ecto.Multi

  def create_new_message(user_id, conversation_id, attrs) do
    attrs
    |> Map.put(:user_id, user_id)
    |> Map.put(:Conversation_id, conversation_id)
    |> Chat.changeset()
    |> Repo.insert()
  end

  def create_or_get_private_conversation(user_id, receiver_id) do
    get_user_private_conversations(user_id)
    |> intersect(^get_user_private_conversations(receiver_id))
    |> Repo.one()
    |> case do
      nil ->
        Multi.new()
        |> Multi.insert(
          :conversation,
          Conversation.changeset(%Conversation{}, %{type: :private, user_id: user_id})
        )
        |> Multi.run(:user_conversation_sender, fn repo, %{conversation: conversation} ->
          %UserConversation{}
          |> UserConversation.changeset(%{
            type: :private,
            user_id: user_id,
            conversation_id: conversation.id
          })
          |> repo.insert()
        end)
        |> Multi.run(:user_conversation_receiver, fn repo, %{conversation: conversation} ->
          %UserConversation{}
          |> UserConversation.changeset(%{
            type: :private,
            user_id: receiver_id,
            conversation_id: conversation.id
          })
          |> repo.insert()
        end)
        |> Repo.transaction()

      conversation ->
        conversation.id
    end
  end

  defp get_user_private_conversations(user_id) do
    from(conv in Conversation,
      join: uc in UserConversation,
      on: uc.conversation_id == conv.id,
      where: conv.type == ^:private and uc.user_id == ^user_id
    )
  end
end
