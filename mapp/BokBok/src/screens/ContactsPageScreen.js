import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, PermissionsAndroid, ToastAndroid } from 'react-native';
import Contacts from 'react-native-contacts';
import { ListItem, Text } from 'react-native-elements';
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
            const resp = await bokbokApi.get('/search_contacts', {
                params: { phone_nos: userContacts.map(contact => contact.phone_number) }
            });
            setSearchResult(resp.data.data);
        } catch (err) {
            console.log("ERROR !", err)
        }
    }

    const addConversation = async (receiver_id) => {
        try {
            await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver_id } });
            ToastAndroid.show("User added to chat List !", ToastAndroid.SHORT);
        } catch (err) {
            console.log("ERROR !", err);
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
                        // error
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
                console.log("yi");
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
            setLoading(false);
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
            <View>
                <Text> Loading... </Text>
                <Spinner isVisible={true} size={20} type={'ThreeBounce'} color='red' size={50} />
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
                        addToChatList={() => addConversation(selectedUser.id)}
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

const styles = StyleSheet.create({});

export default ContactsPageScreen;