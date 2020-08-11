import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import ChatListScreen from './ChatListScreen';
import ChatPageScreen from './ChatPageScreen';
import ExplorePageScreen from './ExplorePageScreen';
import SearchPageScreen from './SearchPageScreen';
import ContactsPageScreen from './ContactsPageScreen';
import SplashScreen from './SplashScreen';
import SignupScreen from './SignupScreen';
import SigninScreen from './SigninScreen';
import EditProfileScreen from './EditProfileScreen';
import EditPasswordScreen from './EditPasswordScreen';
import AsyncStorage from '@react-native-community/async-storage';
import { restore_token, signout } from '../actions/auth';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

const ContainerScreen = ({ token, id, isLoading, restore_token, signout }) => {

    async function saveTokenToDatabase(fcm_token) {

        // Save fcm token with user's id as key, token will be overwritten if the "id" key key is already present
        try {
            database()
                .ref(`/users/${id}`)
                .set({
                    fcm_token: fcm_token,
                })
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {

        if (!id) return; // Avoid saving token when id is not present or not loaded

        // Get the device token
        // For more check, https://rnfirebase.io/messaging/server-integration
        messaging()
            .getToken()
            .then(token => saveTokenToDatabase(token));

        // Listen to whether the token changes, update token if change detected
        return messaging().onTokenRefresh(token => saveTokenToDatabase(token));

    }, [id]); // Update token whenever id changes (user logsin)


    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('id');
        signout();
    }

    const tryLocalSignin = async () => {
        let token;
        try {
            token = await AsyncStorage.getItem('token');
            id = await AsyncStorage.getItem('id');
        } catch (e) {
            console.log("Failed !");
        }
        restore_token(token, id);
    }

    useEffect(() => {
        tryLocalSignin();
    }, []);

    const Stack = createStackNavigator();
    const ChatStack = createStackNavigator();
    const AuthStack = createStackNavigator();
    const Tab = createMaterialTopTabNavigator();
    const ExploreTab = createMaterialBottomTabNavigator();
    const AccountsDrawer = createDrawerNavigator();

    const Auth = () => (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SigninScreen} />
            <AuthStack.Screen name="SignUp" component={SignupScreen} />
        </AuthStack.Navigator>
    );

    const ChatStackComponent = () => (
        <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="ChatList" component={ChatListScreen} />
            <ChatStack.Screen name="ChatPage" component={ChatPageScreen} />
        </ChatStack.Navigator>
    );

    const ExploreTabComponent = () => (
        <ExploreTab.Navigator>
            <ExploreTab.Screen name='ExplorePage' component={ExplorePageScreen} />
            <ExploreTab.Screen name='SearchPeople' component={SearchPageScreen} />
            <ExploreTab.Screen name='Contacts' component={ContactsPageScreen} />
        </ExploreTab.Navigator>
    );

    const AccountsDrawerComponent = () => (

        // A drawer navigator only recieves screens, To add button to drawer add a Custom component and override/pass it with drawerContent props
        <AccountsDrawer.Navigator
            initialRouteName="Edit Profile"
            drawerContent={(props) => {

                return (
                    <ImageBackground source={require('../assets/images/background5.jpg')} style={{ width: '100%', height: '100%' }}>
                        <DrawerContentScrollView {...props} >

                            <DrawerItem
                                label="Accounts Section"
                                labelStyle={{
                                    fontSize: 30,
                                    fontFamily: 'cursive',
                                    height: 50
                                }} />
                            <DrawerItemList {...props} />
                            <DrawerItem label="Logout"
                                onPress={logout}
                                icon={() => <Icon name='sign-out' type='font-awesome' color='navy' size={25} />}
                            />
                        </DrawerContentScrollView>
                    </ImageBackground>
                )
            }}>

            <AccountsDrawer.Screen
                name="Edit Profile"
                component={EditProfileScreen}
                options={{ drawerIcon: () => <Icon name='user' type='font-awesome' color='navy' size={25} /> }} />

            <AccountsDrawer.Screen
                name="Change Password"
                component={EditPasswordScreen}
                options={{
                    drawerIcon: () => <Icon name='lock' type='font-awesome' color='navy' size={25} />
                }} />
        </AccountsDrawer.Navigator>
    );

    const Main = () => (
        <Tab.Navigator>
            <Tab.Screen name='ChatFlow' component={ChatStackComponent} />
            <Tab.Screen name='ExploreFlow' component={ExploreTabComponent} />
            <Tab.Screen name='AccountsFlow' component={AccountsDrawerComponent} />
        </Tab.Navigator>
    );

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

const mapStateToProps = ({ auth: { token: token, id: id, isLoading: isLoading } }) => ({ token, id, isLoading });

const mapDispatchToProps = dispatch => bindActionCreators({ restore_token, signout }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ContainerScreen);
