defmodule BokBok.FCM do
  @firebase_url Application.get_env(:bok_bok, BokBok.FCM)[:firebase_url]
  import Pigeon.FCM.Notification
  require Logger

  def send_notification(users_list, message) do
    users_list
    |> get_fcm_tokens()
    |> send_batch_notifications(message)
  end

  def get_fcm_tokens(users_list) do
    users_list
    |> Enum.map(fn id ->
      HTTPoison.get!("#{@firebase_url}users/#{id}.json")
      |> case do
        %HTTPoison.Response{status_code: 200, body: body} ->
          case Jason.decode!(body) do
            %{"fcm_token" => fcm_token} ->
              fcm_token

            _ ->
              Logger.error("Could not get FCM token for user id: #{id}")
              nil
          end

        _ ->
          Logger.error("Could not get FCM token for user id: #{id}")
          nil
      end
    end)
    |> Enum.reject(&is_nil/1)
  end

  def send_batch_notifications([], _) do
    Logger.warn("No users to send notification")
  end

  def send_batch_notifications(fcm_token_list, %{title: title, body: body}) do
    payload = %{
      "body" => body,
      "title" => title
    }

    notification =
      fcm_token_list
      |> Pigeon.FCM.Notification.new()
      |> put_data(payload)
      # When app is in background, only data messages do not automatically generate a user-visible notification, so we nedd to add the notification in the payload
      |> put_notification(payload)
      |> put_priority(:high)
      |> put_time_to_live(60 * 60 * 24)

    Pigeon.FCM.push(notification,
      on_response: fn n ->
        case n.status do
          :success ->
            Logger.info("Send FCM notification")

          :unauthorized ->
            Logger.error("Failed to send FCM notification: unauthorized")

          _ ->
            n
            |> inspect()
            |> Logger.error()
        end
      end
    )
  end
end
