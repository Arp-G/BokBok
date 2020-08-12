/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

//import messaging from '@react-native-firebase/messaging';
// Handle background FCM notifications
// messaging().setBackgroundMessageHandler(async remoteMessage => () => {
//   console.log(JSON.stringify(remoteMessage));
// });


AppRegistry.registerComponent(appName, () => App);
