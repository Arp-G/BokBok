import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import { ListItem, Text, SearchBar } from 'react-native-elements';
import bokbokApi from '../api/bokbok';
import UserViewModal from '../components/userViewModal';
import EmptyResult from '../components/emptyResult';

const SearchPageScreen = ({ navigation }) => {

  const [search, updateSearch] = useState('');
  const [result, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fireSearch = async () => {
    try {
      const resp = await bokbokApi.get('/search', { params: { query: search } });
      setSearchResult(resp.data.data);
    } catch (err) {
      console.log("ERROR !", err)
    }
  }

  const startChat = async (receiver) => {
    try {
      const response = await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver.id } });
      const conversation = { ...receiver, id: response.data.conversation_id, name: receiver.username, profile: receiver.user_profile };
      setSelectedUser(null);
      navigation.navigate('ChatFlow', { screen: 'ChatPage', params: { conversation } })
    } catch (err) {
      console.log("ERROR !", err);
    }
  }


  useEffect(() => {
    const removeFocusListener = navigation.addListener('focus', () => {
      setSearchResult([]);
    });
    return () => {
      removeFocusListener();
    };
  });


  renderItem = ({ item: search }) => {

    return (
      <ListItem
        title={search.username}
        leftAvatar={{
          source:
            search.user_profile && search.user_profile.avatar
              ? { uri: search.user_profile.avatar.thumbnail }
              : require('../assets/images/avatar-placeholder.png')

        }}
        onPress={() => {
          console.log("SELECTED USER", search)
          setSelectedUser(search);
        }}
        bottomDivider
      />
    );
  };

  return (
    <View style={{ backgroundColor: '#94C0CF' }}>
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
      <SearchBar
        placeholder="Search..."
        onChangeText={updateSearch}
        value={search}
        clearIcon
      />
      <View style={{ marginTop: 10, marginBottom: 10, width: '50%', alignSelf: 'center' }}>
        <Button
          backgroundColor={'red'}
          buttonStyle={{ backgroundColor: 'green' }}
          title="search"
          onPress={fireSearch}
          raised />
      </View>
      {

        result.length > 0
          ? <FlatList
            keyExtractor={(search) => search.id.toString()}
            data={result}
            renderItem={renderItem}
          />
          : <EmptyResult text={"Search for people..."} />
      }

    </View>
  )
}

const styles = StyleSheet.create({});

export default SearchPageScreen;
