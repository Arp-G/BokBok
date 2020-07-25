import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import AccountScreen from './AccountsScreen';
import ChatListScreen from './ChatListScreen';
import ChatPageScreen from './ChatPageScreen';
import GroupChatListScreen from './GroupChatListScreen';
import GroupChatPageScreen from './GroupChatPageScreen';
import SplashScreen from './SplashScreen';
import SignupScreen from './SignupScreen';
import SigninScreen from './SigninScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { restore_token } from '../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const ContainerScreen = ({ token, isLoading, restore_token }) => {

    console.log("TOKEN: " + token);

    const tryLocalSignin = async () => {

        let token;

        try {
            token = await AsyncStorage.getItem('token');
        } catch (e) {
            console.log("Failed !");
        }

        restore_token(token);
    }

    useEffect(() => {
        tryLocalSignin();
    }, []);

    const Stack = createStackNavigator();
    const ChatStack = createStackNavigator();
    const GroupChatStack = createStackNavigator();
    const AuthStack = createStackNavigator();
    const Tab = createMaterialBottomTabNavigator()

    const Auth = () => (
        <AuthStack.Navigator screenOptions={{ headerShown: false  }}>
            <AuthStack.Screen name="SignIn" component={SigninScreen} />
            <AuthStack.Screen name="SignUp" component={SignupScreen} />
        </AuthStack.Navigator>
    );

    const ChatStackComponent = () => (
        <ChatStack.Navigator screenOptions={{ headerShown: false  }}>
            <ChatStack.Screen name="ChatList" component={ChatListScreen} />
            <ChatStack.Screen name="ChatPage" component={ChatPageScreen} />
        </ChatStack.Navigator>
    );

    const GroupChatStackComponent = () => (
        <GroupChatStack.Navigator screenOptions={{ headerShown: false  }}>
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

    console.log("IS LOADING: " + isLoading)

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }} >

                {
                    token
                        ? (<Stack.Screen name="Main" component={Main} />)
                        : (<Stack.Screen name="Auth" component={Auth} />)
                }

            </Stack.Navigator>
        </>
    );
}

const mapStateToProps = ({ auth: { token: token, isLoading: isLoading } }) => ({ token, isLoading });

const mapDispatchToProps = dispatch => bindActionCreators({ restore_token }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContainerScreen);
