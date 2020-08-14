import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, ImageBackgroundImageBackground } from 'react-native';
import { Avatar, Badge, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Socket, Presence } from "phoenix";
import UserViewModal from '../components/userViewModal';
import moment from 'moment';

var Spinner = require('react-native-spinkit');

const ChatPageScreen = ({ navigation, token, id, route: { params: { conversation } } }) => {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [online, setOnline] = useState(false);
  const [chat, setChat] = useState('');
  const [isModalVisible, toggleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateMessageList = (message) => setMessages((messages) => [message, ...messages]);

  const sendMessage = () => {
    if (chat != '') {
      channel.push("new:msg", { body: chat });
      setChat('');
    }
  }

  const updateOnline = (presence) => {
    let online = false;
    presence.list((u_id, { metas: [first, ...rest] }) => {
      online = online || (u_id.toString() != id);
    })
    setOnline(online);
  }

  const fetchMessageList = () => {

    setLoading(true);

    let socket_instance = new Socket("ws://bdf056bb1a03.ngrok.io/socket", { params: { token: token } });

    socket_instance.connect()

    let channel = socket_instance.channel(`conversation:${conversation.id}`, {});
    let presence = new Presence(channel);

    channel.join()
      .receive("ok", resp => {
        setMessages(resp.messages);
        setLoading(false);
      })
      .receive("error", resp => { console.log("Unable to join", resp) });

    channel.on("new:msg", payload => {
      updateMessageList(payload);
    });

    presence.onSync(() => updateOnline(presence));

    setSocket(socket_instance);
    setChannel(channel);
  }

  useEffect(() => {
    // Every time user opens this page fetch latest message details
    const removeFocusListener = navigation.addListener('focus', () => {
      fetchMessageList();
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

  renderItem = ({ item }) => {

    let sender = id == item.sender_id;
    return (
      <View style={{
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 40,
        width: '45%',
        marginBottom: 10,
        padding: 12,
        alignSelf: sender ? 'flex-start' : 'flex-end',
        backgroundColor: sender ? '#323232' : '#fffdd0'
      }}>
        <Text style={{ color: sender ? 'white' : 'black', paddingBottom: 7, textAlign: 'center', textShadowRadius: 30 }}> {item.name} </Text>
        <Text style={{ color: sender ? 'white' : 'black', flex: 1, paddingBottom: 7, flexWrap: 'wrap' }}> {item.message} </Text>
        <Text style={{ color: sender ? 'white' : 'black', fontSize: 9, alignSelf: 'flex-end', fontFamily: 'monospace' }}> {moment(item.time).fromNow()} </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{ paddingBottom: 20 }}> Loading messages...</Text>
        <Spinner isVisible={true} size={20} type={'CircleFlip'} color='red' size={50} />
      </View>);
  }

  return (
    <View style={{ flex: 1 }}>

      <UserViewModal
        isModalVisible={isModalVisible}
        user={{ username: conversation.name }}
        profile={conversation.profile}
        toggleModal={() => toggleModal(false)}
        startChat={null}
      />

      <View style={{ flex: 0.1 }}>
        <TouchableOpacity style={{ flex: 1, alignSelf: 'center', flexDirection: 'row' }} onPress={() => toggleModal(true)}>
          <Avatar
            size="medium"
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            showEditButton
            overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
            source={conversation.profile && conversation.profile.avatar ? { uri: conversation.profile.avatar.thumbnail } : null}
          />
          <View>
            <Text style={{ padding: 5, textAlignVertical: 'center' }}>
              {(conversation.profile && conversation.profile.name) || conversation.name}
            </Text>
            {online ? <Text><Badge status="success" />Online</Text> : <Text><Badge status="error" />Offline</Text>}
          </View>


        </TouchableOpacity>
      </View>

      <View style={{ flex: 0.85 }}>
        <FlatList
          inverted
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={{ flexDirection: 'row', flex: 0.05, minHeight: 20, marginBottom: 5 }} >
        <View style={{ flex: 9, borderColor: '#000080', borderWidth: 2, borderRadius: 20, marginLeft: 5, marginRight: 5, height: '100%' }}>
          <TextInput
            placeholder={'Type your message here...'}
            onChangeText={setChat}
            value={chat}
            style={{ flex: 9 }}
          />
        </View>
        <TouchableOpacity style={{ flex: 1 }} onPress={sendMessage}>
          <Icon name="paper-plane" size={30} color="blue" />
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth: { token: token, id: id }, chat: { conversations: conversations } }) => ({ token, id, conversations });

export default connect(mapStateToProps, null)(ChatPageScreen);
