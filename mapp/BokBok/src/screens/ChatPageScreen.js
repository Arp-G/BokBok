import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Avatar, ListItem, Text, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { Socket, Presence } from "phoenix";
import Modal from 'react-native-modal';

const ChatPageScreen = ({ navigation, token, id, route: { params: { conversation, socket } } }) => {

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);
  const [presence, setPresence] = useState(null);
  const [online, setOnline] = useState(false);
  const [chat, setChat] = useState('');
  const [isModalVisible, toggleModal] = useState(false);

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
    let channel = socket.channel(`conversation:${conversation.id}`, {});
    let presence = new Presence(channel);

    channel.join()
      .receive("ok", resp => {
        setMessages(resp.messages);
      })
      .receive("error", resp => { console.log("Unable to join", resp) });

    channel.on("new:msg", payload => {
      updateMessageList(payload);
    });

    presence.onSync(() => updateOnline(presence));

    setChannel(channel);
    setPresence(presence);
  }

  useEffect(() => {
    // Every time user opens this page fetch latest message details
    const removeFocusListener = navigation.addListener('focus', () => {
      fetchMessageList();
    });

    const removeBlurListener = navigation.addListener('blur', () => {
      channel && channel.leave();
    });

    return () => {
      removeFocusListener();
      removeBlurListener();
    };
  });

  renderItem = ({ item }) => {

    let containerStyle = {
      borderWidth: 2,
      borderColor: 'red',
      borderRadius: 50,
      width: 300,
      alignSelf: (id == item.sender_id) ? 'flex-start' : 'flex-end'
    }

    return (
      <View >
        <ListItem
          key={item.id}
          title={item.name}
          titleStyle={{}}
          rightSubtitle={item.time}
          rightSubtitleStyle={{}}
          subtitle={item.message}
          bottomDivider
          containerStyle={containerStyle}
        />
      </View>


    );
  }

  return (
    <View style={{ flex: 1 }}>

      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }}>
          <View>
            <Avatar
              size="xlarge"
              rounded
              icon={{ name: 'user', type: 'font-awesome' }}
              showEditButton
              overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
              source={(conversation.profile && conversation.profile.avatar && conversation.profile.avatar.original) || require('../assets/images/avatar-placeholder.png')}
            />
            <Text h3>{`Username: ${conversation.name}`}</Text>
            {conversation.profile && conversation.profile.name != '' ? <Text h3>{`Username: ${conversation.profile.name}`}</Text> : null}
            {conversation.profile && conversation.profile.dob != '' ? <Text h3>{`DOB: ${conversation.profile.dob}`}</Text> : null}
            {conversation.profile && conversation.profile.bio != '' ? <Text h3>{`Bio: ${conversation.profile.bio}`}</Text> : null}
          </View>
          <Button title="Close" onPress={() => toggleModal(false)} />
        </View>
      </Modal>

      <View style={{ flex: 0.1 }}>
        <TouchableOpacity onPress={() => toggleModal(true)}>
          <Avatar
            size="medium"
            rounded
            icon={{ name: 'user', type: 'font-awesome' }}
            showEditButton
            overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
            source={(conversation.profile && conversation.profile.avatar && conversation.profile.avatar.thumbnail) || require('../assets/images/avatar-placeholder.png')}
          />
          <Text>
            {(conversation.profile && conversation.profile.name) || conversation.name}
            {online ? 'ONLINE' : 'NOT ONLINE'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 0.8 }}>
        <FlatList
          inverted
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View style={{ flexDirection: 'row', flex: 0.1 }} >
        <View style={{ flex: 9, borderColor: 'red', borderWidth: 2, borderRadius: 20, marginLeft: 5, marginRight: 5, height: '100%' }}>
          <TextInput
            placeholder={'Type here...'}
            onChangeText={setChat}
            value={chat}
            style={{ flex: 9 }}
          />
        </View>
        <TouchableOpacity style={{ flex: 1 }} onPress={sendMessage}>
          <Icon name="paper-plane" size={30} color="black" />
        </TouchableOpacity>

      </View>

    </View>
    // <View>
    //   <MessageList
    //     className='message-list'
    //     lockable={true}
    //     toBottomHeight={'100%'}
    //     dataSource={messages} />


    // </View>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth: { token: token, id: id }, chat: { conversations: conversations } }) => ({ token, id, conversations });

export default connect(mapStateToProps, null)(ChatPageScreen);