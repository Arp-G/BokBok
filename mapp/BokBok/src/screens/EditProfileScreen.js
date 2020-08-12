import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground } from 'react-native';
import bokbokApi from '../api/bokbok';
import { Text, Button, Input, Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DrawerIcon from 'react-native-vector-icons/Ionicons';
var Spinner = require('react-native-spinkit');

const EditProfileScreen = () => {

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setshowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadPercentage, setuploadPercentage] = useState(0);
    const [avatarData, setAvatarData] = useState(null);

    const clearState = () => {
        setName('');
        setAvatar(null);
        setBio('');
        setDob(new Date());
        setshowDatePicker(false);
        setAvatarData(null);
        setuploadPercentage(0);
    }

    const fetchUserProfile = async () => {
        clearState();
        try {
            setLoading(true);
            const { data: { data: { name, bio, dob, avatar } } } = await bokbokApi.get('/user_profile');

            setName(name);
            setBio(bio);
            setDob(new Date(dob));
            setAvatar(avatar ? { uri: avatar.original } : null);
        } catch (err) {
            console.log("ERROR !")
        }
        setLoading(false);
    }

    const updateUserProfile = async () => {

        var FormData = require('form-data');

        var data = new FormData();
        data.append('name', name);
        data.append('bio', bio);
        data.append('dob', dob);
        var config = {}

        if (avatarData || avatarData == '') {
            let av = avatarData == '' ? avatarData : { name: avatarData.fileName, type: avatarData.type, uri: avatarData.uri };
            data.append('avatar', av);
            config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setuploadPercentage(percentCompleted);
                    (percentCompleted == 100) && setSaving(false);
                }
            }
        }

        try {
            setSaving(true);

            await bokbokApi.post('/user_profile', data, config);

        } catch (err) {
            // There is an issue due to which the requests are successfull but there is always an exception (even when there is no fille upload)
            // this happends when using form data, this is probably why "onUploadProgress" wont work and we can't show file upload percentage
            // Issue here: https://github.com/facebook/react-native/issues/28551
            console.log("ERROR !");
        }

        setSaving(false);
        // !avatarData && setSaving(false); Could be helpfull when onUploadProgress() works
    }

    const changeDob = (_event, date) => {
        setshowDatePicker(false);
        setDob(date || dob);
    }

    useEffect(() => {
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
            customButtons: [{ name: 'remove', title: 'Remove Profile picture' }],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            noData: true // If this is not done the whole image binary(base 64 encoded will be given) which leads to memory usage
        };


        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                setAvatar(null);
                setAvatarData('');
            }
            else {
                setAvatarData(response);
                const source = { uri: response.uri };
                setAvatar(source);
            }
        });
    }

    if (loading) {
        return (
            <ImageBackground source={require('../assets/images/background.jpg')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.loading}>
                    <Text style={{ color: 'navy', fontSize: 20 }} > Fetching User profile details...</Text>
                    <Spinner style={styles.spinner} isVisible={true} size={100} type={'Circle'} color='#d35400' size={50} />
                </View>
            </ImageBackground>


        );
    } 

    return (
        <ImageBackground source={require('../assets/images/background1.jpg')} style={{ width: '100%', height: '100%' }}>
            <View style={styles.editProfile}>
                <DrawerIcon
                    style={{ paddingLeft: 10, width: "100%" }}
                    onPress={navigation.toggleDrawer}
                    name="md-menu"
                    size={30}
                />
                <Avatar
                    size="xlarge"
                    rounded
                    onPress={handle_avatar_update}
                    icon={{ name: 'user', type: 'font-awesome' }}
                    showEditButton
                    overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
                    source={avatar || require('../assets/images/avatar-placeholder.png')}
                />

                <Input label="Name"
                    onChangeText={setName}
                    value={name}
                    activeOpacity={0.7}
                    autoCapitalize="none"
                    autoCorrect={false} />

                <TouchableOpacity
                    style={styles.datepicker}
                    onPress={() => setshowDatePicker(true)}>
                    <Input label="Date of Birth"
                        editable={false}
                        value={dob.toDateString()}
                        activeOpacity={0.7}
                        autoCapitalize="none"
                        leftIcon={{ type: 'font-awesome', name: 'calendar', color: 'navy' }}
                        autoCorrect={false} />
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
                    ? <Text>
                        Saving
                    <Spinner style={styles.spinner} isVisible={true} size={20} type={'ThreeBounce'} color='#d35400' size={50} />
                        {/* {`Saving... Uploaded: ${uploadPercentage}`}  Will work when upload % works*/}
                    </Text>
                    : null
                }

                <Button
                    title="Update Profile !"
                    onPress={updateUserProfile}
                    diabled={saving}
                />
            </View>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    loadingView: {
        backgroundColor: '#262626'
    },
    spinner: {
        paddingTop: 100
    },
    loading: {
        paddingTop: "45%",
        alignItems: 'center'
    },
    datepicker: {
        width: "100%",
        marginLeft: 10,
        marginBottom: 20
    },
    editProfile: {
        alignItems: 'center'
    }
})

export default EditProfileScreen;
