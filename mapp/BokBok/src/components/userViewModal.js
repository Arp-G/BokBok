import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Avatar, Button, Text, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

export default ({ isModalVisible, user, profile, toggleModal, startChat }) => {
    return (
        <Modal
            isVisible={isModalVisible}
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
                            <View style={{ margingBottom: 60 }}>
                                <Text style={styles.modalItem}>{`Bio: ${profile.bio}`}</Text>
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
                        containertyle={styles.modalButton}
                        raised
                    />
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'grey',
        borderWidth: 2,
        borderRadius: 50,
        alignItems: 'center'
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