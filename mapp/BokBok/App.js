import React from 'react';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import configureStore from './src/stores/configureStore';
import ContainerScreen from './src/screens/ContainerScreen';

const store = configureStore();

export default () => {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ContainerScreen />
      </NavigationContainer>
    </Provider>
  );
};
