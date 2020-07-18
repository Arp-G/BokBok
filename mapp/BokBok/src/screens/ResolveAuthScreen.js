import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { signin } from '../actions/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
var Spinner = require('react-native-spinkit');


const ResolveAuthScreen = ({ navigation, signin }) => {

  const tryLocalSignin = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      signin(token);
      navigation.navigate("Main", { screen: 'Accounts' });
    }
    else {
      navigation.navigate("Auth", { screen: 'SignIn' });
    }
  }

  useEffect(() => {
    tryLocalSignin();
  }, []);

  return (
    <>
      <Spinner isVisible={true} type={'9CubeGrid'} />
    </>
  );
};

const styles = StyleSheet.create({});

const mapDispatchToProps = dispatch => bindActionCreators({ signin }, dispatch);

export default connect(null, mapDispatchToProps)(ResolveAuthScreen);
