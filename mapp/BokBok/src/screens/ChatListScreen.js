import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ToastAndroid } from 'react-native';
import { Text, ListItem, SearchBar } from 'react-native-elements';
import { load_conversations, update_conversation } from '../actions/chat';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Socket } from "phoenix";
import EmptyResult from '../components/emptyResult';
var Spinner = require('react-native-spinkit');

const ChatListScreen = ({ navigation, token, id, conversations, load_conversations, update_conversation }) => {

    const [socket, setSocket] = useState(null);
    const [search, updateSearch] = useState('');
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchConversationsList = () => {

        let socket_instance = new Socket("ws://a221bb8e6bed.ngrok.io/socket", { params: { token: token } });

        socket_instance.connect();

        let channel = socket_instance.channel(`user:${id}`, {});

        channel.join()
            .receive("ok", resp => {
                ToastAndroid.showWithGravity(
                    "Channel Joined !",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
            })
            .receive("error", resp => {
                ToastAndroid.showWithGravity(
                    "Error, Unable to join cahnnel !",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                );
            });

        channel.push("fetch_conversaions")
            .receive("ok", payload => {
                load_conversations(payload.conversations);
                setLoading(false);
            }
            )
            .receive("error", err => ToastAndroid.showWithGravity(
                "Error, COuld not fetch conversations list !",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM
            ));

        channel.on("update_unread", payload => {
            update_conversation(payload)
        });

        setSocket(socket_instance);
        setChannel(channel);
    }


    useEffect(() => {
        // Every time user opens this page fetch latest user details
        const removeFocusListener = navigation.addListener('focus', () => {
            fetchConversationsList();
        });

        const removeBlurListener = navigation.addListener('blur', () => {
            channel && channel.leave();
            socket && socket.disconnect();
        });

        return () => {
            removeFocusListener();
            removeBlurListener();
        };
    });

    renderItem = ({ item: conversation }) => (<ListItem
        title={conversation.name}
        subtitle={conversation.last_message}
        leftAvatar={{
            source:
                conversation.profile && conversation.profile.avatar
                    ? { uri: conversation.profile.avatar.thumbnail }
                    : require('../assets/images/avatar-placeholder.png')

        }}
        badge={conversation.unseen_message_count > 0 ? { status: "success", value: conversation.unseen_message_count } : null}
        onPress={() => {
            navigation.navigate('Chat', { screen: 'ChatPage', params: { conversation } });
        }}
        bottomDivider
        chevron
    />);


    if (loading) return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={{ paddingBottom: 20 }}> Loading conversations...</Text>
            <Spinner isVisible={true} size={20} type={'Pulse'} color='red' size={50} />
        </View>
    );


    // Chat, ChatPage
    return (
        <View>
            <SearchBar
                placeholder="Search..."
                onChangeText={updateSearch}
                value={search}
                clearIcon
            />
            {conversations.length > 0
                ? <FlatList
                    keyExtractor={(conversation) => conversation.id.toString()}
                    data={conversations.filter(conversation => {
                        let searchString = search.toLowerCase()
                        return conversation.name.toLowerCase().includes(searchString)
                            || (conversation.profile && conversation.profile.name.toLowerCase().includes(searchString))
                    })}
                    renderItem={renderItem}
                />
                : <EmptyResult text={"You dont have any conversations, discover new people to chat with in the explore section.."} />
            }

        </View>
    )


}

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth: { token: token, id: id }, chat: { conversations: conversations } }) => ({ token, id, conversations });

const mapDispatchToProps = dispatch => bindActionCreators({ load_conversations, update_conversation }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatListScreen);
