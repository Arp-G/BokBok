import React from 'react';
import { Provider } from 'react-redux';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import configureStore from './src/stores/configureStore';
import AccountScreen from './src/screens/AccountsScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatPageScreen from './src/screens/ChatPageScreen';
import GroupChatListScreen from './src/screens/GroupChatListScreen';
import GroupChatPageScreen from './src/screens/GroupChatPageScreen';
import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
import SignupScreen from './src/screens/SignupScreen';
import SigninScreen from './src/screens/SigninScreen';

const store = configureStore();
const Stack = createStackNavigator();
const ChatStack = createStackNavigator();
const GroupChatStack = createStackNavigator();
const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator()

const Auth = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="SignIn" component={SigninScreen} />
    <AuthStack.Screen name="SignUp" component={SignupScreen} />
  </AuthStack.Navigator>
);

const ChatStackComponent = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} />
    <ChatStack.Screen name="ChatPage" component={ChatPageScreen} />
  </ChatStack.Navigator>
);

const GroupChatStackComponent = () => (
  <GroupChatStack.Navigator>
    <GroupChatStack.Screen name="GroupChatList" component={GroupChatListScreen} />
    <GroupChatStack.Screen name="GroupChatPage" component={GroupChatPageScreen} />
  </GroupChatStack.Navigator>
);

const Main = () => (
  <Tab.Navigator>
    <Tab.Screen name='ChatFlow' component={ChatStackComponent} />
    <Tab.Screen name='GroupChatFlow' component={GroupChatStackComponent} />
    <Tab.Screen name='Accounts' component={AccountScreen} />
  </Tab.Navigator>
);

export default () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ResolveAuth" component={ResolveAuthScreen} />
          <Stack.Screen name="Auth" component={Auth} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};