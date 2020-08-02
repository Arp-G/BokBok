import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


const ChatPageScreen = ({ navigation, route: { params: { conversation, socket } } }) => {

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(null);

  const updateMessageList = (message) => {
    console.log("list:", messages);
    setMessages((messages) => [...messages, message])
  };


  const fetchMessageList = () => {
    let channel = socket.channel(`conversation:${conversation.id}`, {});

    channel.join()
      .receive("ok", resp => {
        setMessages(resp.messages);
      })
      .receive("error", resp => { console.log("Unable to join", resp) });

    channel.on("new:msg", payload => {
      updateMessageList(payload);
    });

    setChannel(channel);

    // channel.push("fetch_conversaions")
    //   .receive("ok", payload => {
    //     console.log(payload);
    //     load_conversations(payload.conversations)
    //   }
    //   )
    //   .receive("error", err => console.log("phoenix errored", err));
  }

  useEffect(() => {
    // Every time user opens this page fetch latest user details
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
    console.log(item);
    return (<Text> {`${item.name}:  ${item.message}`} </Text>);
  }

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = ({ auth: { token: token } }) => ({ token });

export default connect(mapStateToProps, null)(ChatPageScreen);