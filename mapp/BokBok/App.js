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

  // Handle foreground FCM notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      showMessage({
        message: JSON.stringify(remoteMessage),
        type: "info",
      });
    });

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
