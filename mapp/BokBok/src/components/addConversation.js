import bokbokApi from '../api/bokbok';
import { ToastAndroid } from 'react-native';

export default async (receiver_id) => {
    try {
        await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver_id } });
        ToastAndroid.show("User added to chat List !", ToastAndroid.SHORT);
    } catch (err) {
        console.log("ERROR !", err);
    }
}
