import React, { useState, useEffect, useCallback } from 'react';
import { View, RefreshControl, SafeAreaView, ToastAndroid } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import bokbokApi from '../api/bokbok';
import Carousel from 'react-native-snap-carousel';
import { getConversation } from '../helpers/helper';

const ExplorePageScreen = ({ navigation }) => {

  const [randomPeople, setRandomPeople] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = useCallback(() => getRandomPeopleList(), []);

  const addConversation = async (receiver) => {
    try {
      const conversation = await getConversation(receiver);
      navigation.navigate('Chat', { screen: 'ChatPage', params: { conversation } })
    } catch (err) {
      ToastAndroid.showWithGravity(
        "Failed to fetch conversation ID !",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  }

  const getRandomPeopleList = async () => {
    try {
      const resp = await bokbokApi.get('/get_random');
      setRandomPeople(resp.data.data);
    } catch (err) {
      ToastAndroid.showWithGravity(
        "Failed to fetch people list !",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
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

  renderItem = ({ item: people }) => {
    return (
      <View
        style={{
          flex: 0.85,
          backgroundColor: 'floralwhite',
          borderRadius: 5,
          padding: 50,
          marginLeft: 25,
          marginRight: 25,
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
        <Avatar
          size="xlarge"
          rounded
          icon={{ name: 'user', type: 'font-awesome' }}
          overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
          source={(people.user_profile && people.user_profile.avatar && people.user_profile.avatar.original)
            ? { uri: people.user_profile.avatar.original }
            : require('../assets/images/avatar-placeholder.png')
          }
        />
        <Text style={{ fontSize: 25, fontWeight: 'bold' }}>{people.username}</Text>
        {people.user_profile && people.user_profile.name != '' ? <Text h6> {`Name: ${people.user_profile.name}`}</Text> : null}
        {people.user_profile && people.user_profile.dob != '' ? <Text h6>{`DOB: ${people.user_profile.dob}`}</Text> : null}
        {people.user_profile && people.user_profile.bio != '' ? <Text h6>{`Bio: ${people.user_profile.bio}`}</Text> : null}
        <View style={{ justifyContent: 'center' }}>
          <Button
            title={'Chat !'}
            onPress={() => addConversation(people)} />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'tomato', paddingTop: 50, }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
        <Carousel
          layout={"default"}
          data={randomPeople}
          sliderWidth={363}
          itemWidth={350}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          } />
      </View>
    </SafeAreaView>
  );
};

export default ExplorePageScreen;
