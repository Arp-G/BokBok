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
              %{id: id, fcm_token: fcm_token}

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

  def send_batch_notifications(fcm_token_list, %{type: type, body: body}) do
    # TODO
  end
end
