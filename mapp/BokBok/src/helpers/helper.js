import bokbokApi from '../api/bokbok';
import { ToastAndroid } from 'react-native';

export const SITE_URL = 'http://a221bb8e6bed.ngrok.io';
export const API = `${SITE_URL}/api`;
export const WEBSOCKET_API = `${SITE_URL.replace('http', 'ws')}/socket`;

export const getConversation = async (receiver) => {
  try {
    const { username, data, user_profile } = await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver.id } });
    return { ...receiver, id: data.conversation_id, name: username, profile: user_profile };
  } catch (err) {
    ToastAndroid.showWithGravity(
      "Failed to fetch conversation ID !",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }
}
