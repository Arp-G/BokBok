import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import Modal from 'react-native-modal';

export default ({ isModalVisible, user, profile, toggleModal, addToChatList }) => {
    return (
        <Modal isVisible={isModalVisible}>
            <View style={{ flex: 1 }}>
                <View>
                    <Avatar
                        size="xlarge"
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        showEditButton
                        overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
                        source={(profile && profile.avatar && profile.avatar.original) || require('../assets/images/avatar-placeholder.png')}
                    />
                    <Text h3>{`Username: ${user.username}`}</Text>
                    {profile && profile.name != '' ? <Text h3>{`Username: ${profile.name}`}</Text> : null}
                    {profile && profile.dob != '' ? <Text h3>{`DOB: ${profile.dob}`}</Text> : null}
                    {profile && profile.bio != '' ? <Text h3>{`Bio: ${profile.bio}`}</Text> : null}
                </View>
                <Button title="Close" onPress={() => toggleModal(false)} />
                <Button title={"Add user to chat list..."} onPress={addToChatList} />
            </View>
        </Modal>
    );
}
