import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import configureStore from './src/stores/configureStore';
import ContainerScreen from './src/screens/ContainerScreen';
import messaging from '@react-native-firebase/messaging';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";

const store = configureStore();

export default () => {

  const showNotification = remoteMessage => (showMessage({
    message: remoteMessage.data.title,
    description: remoteMessage.data.body,
    type: "info",
    duration: 4000,
    floating: true,
    icon: "auto"
  }));

  // Handle foreground FCM notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => (showNotification(remoteMessage)));

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContainerScreen />
      </NavigationContainer>
      <FlashMessage position="top" />
    </Provider>
  );
};
