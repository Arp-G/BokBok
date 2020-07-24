import React from 'react';
import { StyleSheet, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from 'redux';
import { SafeAreaView } from 'react-navigation';
import { signout } from '../actions/auth';
import { connect } from 'react-redux';

const AccountsScreen = ({ signout, navigation }) => {

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    signout();
    // navigation.navigate('Auth', 'SignIn');
  }

  return (
    <SafeAreaView forceInset={{ top: 'always' }}>
      <Text style={{ fontSize: 48 }}>AccountScreen</Text>
      <Button title="Sign Out" onPress={logout} />
    </SafeAreaView>
  );
};


const mapDispatchToProps = dispatch => bindActionCreators({ signout }, dispatch);

const styles = StyleSheet.create({});

export default connect(null, mapDispatchToProps)(AccountsScreen);
