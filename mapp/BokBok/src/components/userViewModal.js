import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { Avatar, Button, Text, Icon } from 'react-native-elements';

export default ({ isModalVisible, user, profile, toggleModal, startChat }) => {
    return (
        <Modal
            visible={isModalVisible}
        >
            <View style={styles.modal}>
                <View>
                    <Avatar
                        size="xlarge"
                        rounded
                        icon={{ name: 'user', type: 'font-awesome' }}
                        showEditButton
                        overlayContainerStyle={{ backgroundColor: 'black', opacity: 0.7 }}
                        source={profile && profile.avatar ? { uri: profile.avatar.original } : null}
                        containerStyle={styles.modalAvatar}
                    />
                    <Text style={styles.modalItem}>{`${user.username}`}</Text>
                    {profile && profile.name != '' ? <Text style={styles.modalItem}>{`Name: ${profile.name}`}</Text> : null}
                    {profile && profile.dob != '' ? <Text style={styles.modalItem}>{`DOB: ${profile.dob}`}</Text> : null}
                    {profile && profile.bio != ''
                        ? (
                            <View style={{ alignSelf: 'flex-start', margingBottom: 60, marginLeft: 10, maxWidth: 200 }}>
                                <Text style={{ fontSize: 17 }}>{`Bio: ${profile.bio}`}</Text>
                            </View>
                        )
                        : null
                    }
                </View>
                <View style={styles.modalButton}>
                    {startChat &&
                        <Button
                            title={"Chat !"}
                            onPress={startChat}
                        />
                    }
                </View>
                <View style={styles.modalButton}>
                    <Button
                        title="Close"
                        onPress={() => toggleModal(false)}
                        raised
                    />
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modal: {
        marginTop: 30,
        flex: 0.9,
        width: '90%',
        justifyContent: 'center',
        backgroundColor: 'grey',
        borderWidth: 2,
        borderRadius: 50,
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalAvatar: {
        alignSelf: 'center'
    },
    modalItem: {
        alignSelf: 'center',
        fontSize: 17,
        width: '50%',
        padding: 4,
        marginBottom: 10
    },
    modalButton: {
        marginTop: 10,
        width: '80%'
    }

});