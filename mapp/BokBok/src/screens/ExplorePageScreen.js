import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, RefreshControl, ToastAndroid, ScrollView } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import bokbokApi from '../api/bokbok';


const ExplorePageScreen = ({ navigation }) => {

  const [randomPeople, setRandomPeople] = useState([]);
  const [refreshing, setRefreshing] = useState(true);


  const onRefresh = useCallback(() => {
    getRandomPeopleList();
  }, []);

  const addConversation = async (receiver_id) => {
    try {
      await bokbokApi.get('/get_conversation', { params: { receiver_id: receiver_id } });
      ToastAndroid.show("User added to chat List !", ToastAndroid.SHORT);
      setRandomPeople(randomPeople.filter((people) => people.id != receiver_id));
    } catch (err) {
      console.log("ERROR !", err);
    }
  }

  const getRandomPeopleList = async () => {
    try {
      const resp = await bokbokApi.get('/get_random');
      setRandomPeople(resp.data.data);
    } catch (err) {
      console.log("ERROR !", err)
    }
    setRefreshing(false);
  }

  useEffect(() => {
    const removeFocusListener = navigation.addListener('focus', () => {
      getRandomPeopleList();
    });

    return () => {
      removeFocusListener();
    };
  });

  return (
    <ScrollView
      pagingEnabled
      horizontal
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {
        randomPeople.map((people) => (
          <View key={people.id}>
            <View style={{ flex: 1, width: '100%' }}>
              <Avatar
                size="xlarge"
                rounded
                icon={{ name: 'user', type: 'font-awesome' }}
                showEditButton
                overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
                source={(people.profile && people.profile.avatar && people.profile.avatar.original) || require('../assets/images/avatar-placeholder.png')}
              />
              <Text h3>{`Username: ${people.username}`}</Text>
              {people.user_profile && people.user_profile.name != '' ? <Text h3>{`Username: ${people.user_profile.name}`}</Text> : null}
              {people.user_profile && people.user_profile.dob != '' ? <Text h3>{`DOB: ${people.user_profile.dob}`}</Text> : null}
              {people.user_profile && people.user_profile.bio != '' ? <Text h3>{`Bio: ${people.user_profile.bio}`}</Text> : null}
            </View>
            <Button title={'Add to chat list !'} onPress={() => addConversation(people.id)} />
          </View>

        ))
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default ExplorePageScreen;
