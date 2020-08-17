import bokbokApi from '../api/bokbok';
import { ToastAndroid } from 'react-native';


export const getConversation = async (receiver) => {
  try {
    const { data } = await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver.id } });
    return { ...receiver, id: data.conversation_id, name: receiver.username, profile: receiver.user_profile };
  } catch (err) {
    ToastAndroid.showWithGravity(
      "Failed to fetch conversation ID !",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }
}
