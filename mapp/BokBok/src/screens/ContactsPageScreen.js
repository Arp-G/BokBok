import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, PermissionsAndroid, ToastAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { ListItem, Text, Image } from 'react-native-elements';
import UserViewModal from '../components/userViewModal';
import bokbokApi from '../api/bokbok';

const ContactsPageScreen = ({ navigation }) => {

    const [loading, setLoading] = useState(true);
    const [userContacts, setContacts] = useState([]);
    const [searchResults, setSearchResult] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    var Spinner = require('react-native-spinkit');

    const fireContactSearch = async () => {
        try {
            const resp = await bokbokApi.post('/search_contacts', { phone_nos: userContacts.map(contact => contact.phone_number) });
            setSearchResult(resp.data.data);
        } catch (err) {
            ToastAndroid.showWithGravity(
                "Error, failed to search contacts !",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }

        setLoading(false);
    }

    const startChat = async (receiver) => {
        try {
            const response = await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver.id } });
            const conversation = { ...receiver, id: response.data.conversation_id }
            setSelectedUser(null);
            navigation.navigate('Chat', { screen: 'ChatPage', params: { conversation } })
        } catch (err) {
            ToastAndroid.showWithGravity(
                "Error, failed to fetch conversation ID !",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            );
        }
    }


    const requestContactPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: "Contacts",
                    message:
                        "BokBok needs access to your contacts, to check if they they are on BokBOk",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Contacts.getAll((err, contacts) => {
                    if (err === 'denied') {
                        ToastAndroid.showWithGravity(
                            "Contact Permission Denied !",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM
                        );
                    } else {
                        setContacts(
                            contacts.map(contact => (
                                {
                                    name: contact.displayName,
                                    phone_number: contact.phoneNumbers[0] && contact.phoneNumbers[0].number
                                }
                            ))
                        )
                    }
                })
            } else {
                ToastAndroid.showWithGravity(
                    "Contact Permission Denied !",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        const removeFocusListener = navigation.addListener('focus', () => {
            setLoading(true);
            requestContactPermission();
            fireContactSearch();
        });

        return () => {
            removeFocusListener();
        };
    });


    renderItem = ({ item: user }) => {

        return (
            <ListItem
                title={user.username}
                leftAvatar={{
                    source:
                        user.user_profile && user.user_profile.avatar
                            ? { uri: user.user_profile.avatar.thumbnail }
                            : require('../assets/images/avatar-placeholder.png')

                }}
                onPress={() => {
                    setSelectedUser(user);
                }}
                bottomDivider
            />
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text> Loading... </Text>
                <Spinner isVisible={true} size={20} type={'ThreeBounce'} color='red' size={50} />
            </View>
        );
    }

    if (searchResults.length == 0) {
        return (
            <View style={styles.container}>
                <Text> None of your contacts are on BokBok..</Text>
                <Image source={require('../assets/images/sad-emoji.png')} style={{ width: 200, height: 200 }} />
            </View>
        );
    }


    return (
        <View>
            {selectedUser
                ? <>
                    <UserViewModal
                        isModalVisible={selectedUser ? true : false}
                        user={selectedUser}
                        profile={selectedUser.user_profile}
                        toggleModal={setSelectedUser}
                        startChat={() => startChat(selectedUser)}
                    />
                </>
                : null
            }
            <FlatList
                keyExtractor={(user) => user.id.toString()}
                data={searchResults}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ContactsPageScreen;
