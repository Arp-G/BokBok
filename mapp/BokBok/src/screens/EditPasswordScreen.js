import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
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
            console.log("ERROR !")
            console.log(err.response.data)
        }
        setSaving(false);
    }


    return (
        <>
            <Icon
                style={{ paddingLeft: 10 }}
                onPress={navigation.toggleDrawer}
                name="md-menu"
                size={30}
            />
            <Input label="Current Password"
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
                secureTextEntry
                leftIcon={{ type: 'font-awesome', name: 'phone-square', color: 'navy' }}
                autoCorrect={false}
                errorMessage={error.error} />
            <Input label="Password"
                onChangeText={setPassword}
                autoCapitalize="none"
                secureTextEntry
                leftIcon={{ type: 'font-awesome', name: 'phone-square', color: 'navy' }}
                autoCorrect={false}
                errorMessage={error.errors && error.errors["password"] ? error.errors["password"].join(", ") : ""} />
            {saving
                ?
                (<>
                    <Text> Saving... </Text>
                    <Spinner isVisible={true} size={20} type={'ThreeBounce'} color='#d35400' size={50} />
                </>)
                : null
            }
            <Button
                title="Update Password !"
                onPress={updateUserPassword}
                diabled={saving}
            />
        </>
    );
};


export default EditPasswordScreen;
