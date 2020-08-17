import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, ToastAndroid } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import bokbokApi from '../api/bokbok';
import UserViewModal from '../components/userViewModal';
import EmptyResult from '../components/emptyResult';
import { getConversation } from '../helpers/helper';

const SearchPageScreen = ({ navigation }) => {

  const [search, updateSearch] = useState('');
  const [result, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fireSearch = async () => {
    try {
      const resp = await bokbokApi.get('/search', { params: { query: search } });
      setSearchResult(resp.data.data);
    } catch (err) {
      ToastAndroid.showWithGravity(
        "Error, Search Failed !",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
    }
  }

  const startChat = async (receiver) => {
    try {
      const conversation = await getConversation(receiver);
      setSelectedUser(null);
      navigation.navigate('Chat', { screen: 'ChatPage', params: { conversation } })
    } catch (err) {
      ToastAndroid.showWithGravity(
        "Error, Failed to fetch Conversation ID !",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
    }
  }

  useEffect(() => {
    const removeFocusListener = navigation.addListener('focus', () => setSearchResult([]));
    return () => removeFocusListener();
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
        onPress={() => setSelectedUser(search)}
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

export default SearchPageScreen;
