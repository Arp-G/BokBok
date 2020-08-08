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
  end

  def get_conversation_messages(conv_id) do
    from(c in Chat,
      join: conv in Conversation,
      on: conv.id == c.conversation_id,
      inner_join: u in User,
      on: u.id == c.user_id,
      order_by: [desc: c.inserted_at],
      where: conv.id == ^conv_id,
      select: %{
        id: c.id,
        sender_id: c.user_id,
        message: c.message,
        name: u.username,
        time: c.inserted_at
      }
    )
    |> Repo.all()
  end

  def get_users_conversations(user_id, type \\ :private) do
    from(conv in Conversation,
      join: uc in UserConversation,
      on: uc.conversation_id == conv.id,
      left_join: u1 in User,
      on: u1.id == uc.receiver_id,
      left_join: u2 in User,
      on: u2.id == uc.last_sender_id,
      left_join: up in UserProfile,
      on: up.user_id == u1.id,
      select: %{
        id: conv.id,
        name: u1.username,
        profile: up,
        type: conv.type,
        inserted_at: conv.inserted_at,
        created_by: conv.user_id,
        last_sender: u2.username,
        unseen_message_count: uc.unseen_message_count,
        last_message: uc.last_message
      },
      where: conv.type == ^type and uc.user_id == ^user_id,
      order_by: [desc: conv.updated_at]
    )
    |> Repo.all()
    |> Enum.map(fn %{profile: profile} = item ->
      profile =
        if profile,
          do: BokBokWeb.UserProfileView.render("user_profile.json", %{user_profile: profile}),
          else: nil

      Map.put(item, :profile, profile)
    end)
  end

  def update_unseen_message(user_id, conv_id, last_sender_id, last_message) do
    from(uc in UserConversation,
      where: uc.user_id == ^user_id and uc.conversation_id == ^conv_id,
      update: [
        set: [
          last_sender_id: ^last_sender_id,
          last_message: ^last_message
        ],
        inc: [unseen_message_count: 1]
      ]
    )
    |> Repo.update_all([])
  end

  def reset_unseen_message(user_id, conv_id) do
    from(uc in UserConversation, where: uc.user_id == ^user_id and uc.conversation_id == ^conv_id)
    |> Repo.update_all(set: [last_sender_id: nil, last_message: nil, unseen_message_count: 0])
  end

  def correct_user?(user_id, conversation_id) do
    from(uc in UserConversation,
      where: uc.user_id == ^user_id and uc.conversation_id == ^conversation_id
    )
    |> Repo.one()
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
            receiver_id: receiver_id,
            conversation_id: conversation.id
          })
          |> repo.insert()
        end)
        |> Multi.run(:user_conversation_receiver, fn repo, %{conversation: conversation} ->
          %UserConversation{} |> UserConversation.changeset(%{  type: :private, user_id: receiver_id,  receiver_id: user_id, conversation_id: conversation.id })
          |> repo.insert()
        end)
        |> Repo.transaction()
        |> case do
          %{conversation: conversation} ->
            conversation

          {:ok, %{conversation: conversation}} ->
            conversation

          _ ->
            {:error, "could not create conversation"}
        end

      conversation ->
        conversation
    end
  end

  def list_participants_for_conversation(conv_id) do
    from(uc in UserConversation, where: uc.conversation_id == ^conv_id)
    |> Repo.all()
    |> Enum.map(fn %UserConversation{user_id: user_id} -> user_id end)
  end

  def get_user_private_conversations(user_id) do
    from(conv in Conversation,
      join: uc in UserConversation,
      on: uc.conversation_id == conv.id,
      where: conv.type == ^:private and uc.user_id == ^user_id
    )
  end
end
