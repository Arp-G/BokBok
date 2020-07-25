import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import bokbokApi from '../api/bokbok';
import { Text, Button, Input, Avatar, Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import PasswordForm from './PasswordForm';
import DateTimePicker from '@react-native-community/datetimepicker'
var Spinner = require('react-native-spinkit');


const ProfileForm = ({ navigation }) => {

    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setshowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await bokbokApi.get('/user_profile');
            setName(response.data.data.name);
            setBio(response.data.data.bio);
            setDob(new Date(response.data.data.dob));
        } catch (err) {
            console.log("ERROR !")
            console.log(err)
        }
        setLoading(false);
    }

    const updateUserProfile = async () => {
        try {
            setSaving(true);
            await bokbokApi.post('/user_profile', { name, dob, bio });
        } catch (err) {
            console.log("ERROR !")
            console.log(err)
        }
        setSaving(false);
    }

    const changeDob = (_event, date) => {
        setDob(dob || date);
        setshowDatePicker(false);
    }

    useEffect(() => {
        console.log(navigation);
        // Every time user opens this page fetch latest user details
        const removeListener = navigation.addListener('focus', () => {
            setLoading(true);
            fetchUserProfile();
        });

        return removeListener; // Remove listener
    });

    const handle_avatar_update = () => {

        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };


        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                // this.setState({
                //   avatarSource: source,
                // });
            }
        });
    }

    if (loading) {
        return (
            <>
                <Spinner isVisible={true} size={100} type={'9CubeGrid'} color='#d35400' />
            </>);
    }



    return (
        <>
            <Avatar
                size="large"
                rounded
                title="CR"
                onPress={handle_avatar_update}
                showEditButton
            />

            <Input label="Name"
                onChangeText={setName}
                value={name}
                autoCapitalize="none"
                autoCorrect={false} />

            <TouchableOpacity
                style={styles.datepicker}
                onPress={() => setshowDatePicker(true)}>
                <Text>
                    <Icon
                        reverse
                        name='calendar'
                        type='font-awesome'
                        color='navy'
                        size= {12}
                    />DOB: </Text>
                <Text>{dob.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && <DateTimePicker
                value={dob}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                mode="date"
                display="spinner"
                onChange={changeDob}
                isVisible={false}
            />}

            <Input label="Bio"
                value={bio}
                onChangeText={setBio} 
                leftIcon={{ type: 'font-awesome', name: 'user-circle-o', color: 'navy' }}
                />

            {saving
                ? <Text> Saving... </Text>
                : null
            }

            <Button
                title="Update Profile !"
                onPress={updateUserProfile}
                diabled={saving}
            />

            <PasswordForm />
        </>
    );
};


const styles = StyleSheet.create({
    datepicker: {
        width: 100,
        marginLeft: 10,
        marginBottom: 20
    }
})

export default ProfileForm;
