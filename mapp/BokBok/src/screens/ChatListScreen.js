import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { ListItem, Text, SearchBar } from 'react-native-elements';
import { load_conversations, update_conversation } from '../actions/chat';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Socket } from "phoenix";


const ChatListScreen = ({ navigation, token, id, conversations, load_conversations, update_conversation }) => {

    const [socket, setSocket] = useState(null);
    const [search, updateSearch] = useState('');
    const [channel, setChannel] = useState(null);

    const fetchConversationsList = () => {

        let socket_instance = socket || new Socket("ws://cc413f95ff4d.ngrok.io/socket", { params: { token: token } });

        socket_instance.connect()

        console.log("SOCKET CONNECTED !")

        let channel = socket_instance.channel(`user:${id}`, {});

        channel.join()
            .receive("ok", resp => {
                console.log("CHANNEL JOINED !")
            })
            .receive("error", resp => { console.log("Unable to join", resp) });

        channel.push("fetch_conversaions")
            .receive("ok", payload => {
                console.log(payload);
                load_conversations(payload.conversations)
            }
            )
            .receive("error", err => console.log("phoenix errored", err));

        channel.on("update_unread", payload => {
            console.log("UPDATE WITH PAYLOAD " + payload);
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
        });

        return () => {
            removeFocusListener();
            removeBlurListener();
        };
    });

    renderItem = ({ item: conversation }) => {

        console.log(conversation);

        return (<ListItem
            title={conversation.name}
            subtitle={conversation.last_message}
            leftAvatar={{
                source:
                    conversation.profile && conversation.profile.avatar
                        ? { uri: conversation.profile.avatar.thumbnail }
                        : require('../assets/images/avatar-placeholder.png')

            }}
            badge={{ value: conversation.unseen_message_count }}
            onPress={() => {
                navigation.navigate('ChatFlow', { screen: 'ChatPage', params: { conversation, socket } },);
            }}
            bottomDivider
            chevron
        />);
    };


    // ChatFlow, ChatPage
    return (
        <View>
            <SearchBar
                placeholder="Search..."
                onChangeText={updateSearch}
                value={search}
                clearIcon
            />
            <FlatList
                keyExtractor={(conversation) => conversation.id.toString()}
                data={conversations.filter(conversation => {
                    let searchString = search.toLowerCase()
                    return conversation.name.toLowerCase().includes(searchString)
                        || (conversation.profile && conversation.profile.name.toLowerCase().includes(searchString))
                })}
                renderItem={renderItem}
            />
        </View>
    )


}

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth: { token: token, id: id }, chat: { conversations: conversations } }) => ({ token, id, conversations });

const mapDispatchToProps = dispatch => bindActionCreators({ load_conversations, update_conversation }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ChatListScreen);

  // {
  //   "created_by": 1,
  //   "id": 6,
  //   "inserted_at": "2020-08-01T07:01:43Z",
  //   "last_message": null,
  //   "last_sender": null,
  //   "name": "arp",
  //   "profile": {
  //     "avatar": {
  //       "original": "https://s3.ap-south-1.amazonaws.com/bokbok/uploads/bokbok/user_profiles/avatars/000/000/000/001/6c2ce730827ac229a2c2887ff8c11aaec689c83a.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQLZXPQNO7XIKB4N7%2F20200801%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20200801T071648Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=c13fd98da23aa1b652b34b5c66710156fbc86cc5683b7d3a8b5dcf32d186dee8",
  //       "thumbnail": "https://s3.ap-south-1.amazonaws.com/bokbok/uploads/bokbok/user_profiles/avatars/000/000/000/001/a5d56d67efce784900b288361bac27b09e3a7d2b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAQLZXPQNO7XIKB4N7%2F20200801%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20200801T071648Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&X-Amz-Signature=b4600a016f8b75103a9cf22f378266284fedbd2980de3c9daeeb63711517155a"
  //     },
  //     "bio": "Learning react native development",
  //     "dob": "1997-09-18",
  //     "name": "Arpan Dev",
  //     "user_id": 1
  //   },
  //   "type": "private",
  //   "unseen_message_count": 0
  // }
