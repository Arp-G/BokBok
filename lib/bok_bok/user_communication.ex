defmodule BokBok.UserCommunication do
  alias BokBok.Repo
  alias BokBok.Accounts.{User, UserProfile}
  alias BokBok.UserCommunication.{Chat, Conversation, UserConversation}
  import Ecto.Query
  alias Ecto.Multi

  def create_new_message(user_id, conversation_id, attrs) do
    attrs
    |> Map.put(:user_id, user_id)
    |> Map.put(:conversation_id, conversation_id)
    |> Chat.changeset()
    |> Repo.insert()

    # Either do this or keep a separate table to keep track of when the conversation was lastupdated and what was the last message
    # updated_at = DateTime.utc_now()

    # from(conv in Conversation, where: conv.id == ^conversation_id)
    # |> update(set: [updated_at: ^updated_at])
    # |> Repo.update_all([])
  end

  def get_conversation_messages(conv_id) do
    from(c in Chat,
      join: conv in Conversation,
      on: conv.id == c.conversation_id,
      left_join: up in UserProfile,
      on: up.user_id == c.user_id,
      order_by: [desc: c.inserted_at],
      where: conv.id == ^conv_id,
      select: %{message: c.message, name: up.name, time: c.inserted_at}
    )
    |> Repo.all()
  end

  def get_users_conversations(user_id, type \\ :private) do
    from(conv in Conversation,
      join: uc in UserConversation,
      on: uc.conversation_id == conv.id,
      where: conv.type == ^type and uc.user_id == ^user_id,
      order_by: [desc: conv.updated_at]
    )
    |> Repo.all()
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
        |> case do
          %{conversation: conversation} -> conversation
          _ -> {:error, "could not create conversation"}
        end

      conversation ->
        conversation
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
