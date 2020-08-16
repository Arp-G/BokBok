import React, { useState } from 'react';
import { View, ImageBackground, ToastAndroid } from 'react-native';
import bokbokApi from '../api/bokbok';
import { Text, Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
var Spinner = require('react-native-spinkit');

const EditPasswordScreen = () => {
    const navigation = useNavigation();
    const [current_password, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState({});

    const updateUserPassword = async () => {
        try {
            setSaving(true);
            await bokbokApi.patch('/update_password', { current_password, password });
            setError({});
        } catch (err) {
            setError(err.response.data);
            ToastAndroid.showWithGravity(
                "Failed to update password !",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        }
        setSaving(false);
    }


    return (
        <>
            <ImageBackground source={require('../assets/images/background4.jpg')} style={{ width: '100%', height: '100%' }}>
                <Icon
                    style={{ paddingLeft: 10 }}
                    onPress={navigation.toggleDrawer}
                    name="md-menu"
                    size={30}
                />
                <Text h3 style={{ marginLeft: 30, marginTop: 30 }}> Update your password</Text>
                <View style={{ marginTop: "25%", alignItems: 'center' }}>
                    <Input label="Current Password"
                        onChangeText={setCurrentPassword}
                        autoCapitalize="none"
                        secureTextEntry
                        leftIcon={{ type: 'font-awesome', name: 'unlock-alt', color: 'navy' }}
                        autoCorrect={false}
                        errorMessage={error.error} />
                    <Input label="Password"
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        secureTextEntry
                        leftIcon={{ type: 'font-awesome', name: 'unlock-alt', color: 'navy' }}
                        autoCorrect={false}
                        errorMessage={error.errors && error.errors["password"] ? error.errors["password"].join(", ") : ""} />
                    <Button
                        title="Update Password !"
                        onPress={updateUserPassword}
                        diabled={saving}
                    />
                    {saving
                        ?
                        (<View style={{ paddingTop: 20 }}>
                            <Text> Saving... </Text>
                            <Spinner isVisible={true} size={20} type={'ThreeBounce'} color='red' size={50} />
                        </View >)
                        : null
                    }
                </View>
            </ImageBackground>

        </>
    );
};


export default EditPasswordScreen;
