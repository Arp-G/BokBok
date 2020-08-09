import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Alert } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import configureStore from './src/stores/configureStore';
import ContainerScreen from './src/screens/ContainerScreen';
import messaging from '@react-native-firebase/messaging';

const store = configureStore();

export default () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContainerScreen />
      </NavigationContainer>
    </Provider>
  );
};
