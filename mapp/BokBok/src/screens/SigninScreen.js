import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';

const SigninScreen = ({ signin, navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const clearState = () => {
    console.log("Cleared State !")
    setUsername('');
    setPassword('');
    setError('');
  }

  useEffect(() => {
    const removeListener = navigation.addListener('blur', () => {
      clearState();
    });

    return removeListener; // Remove listener
  });


  const onSubmit = async ({ username, password }) => {

    try {

      const reponse = await bokbokApi.post('/sign_in', { username, password });

      await AsyncStorage.setItem('token', reponse.data.token);
      console.log(reponse.data.token);
      signin(reponse.data.token);
      navigation.navigate('Main', { screen: 'Accounts' });
    } catch (err) {
      setError('Wrong username or password !');
    }

  }

  return (
    <View>
      <>
        <Text h3>Sign In to Bok Bok</Text>
        <Input label="Username"
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false} />
        <Input label="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        <NavLink
          routeName="Auth"
          nestedRoute={{ screen: 'SignUp' }}
          text="Don't have an account? Sign up now!"
        />
        <Text>
          {error}
        </Text>
        <Button
          title="Sign In !"
          onPress={() => onSubmit({ username, password })}
        />
      </>
    </View>
  );
};



/*
  signin is an action, which we import from "actions/auth", through mapDispatchToProps we provide a props.signin function
  to this component, this version of signin is created by "bindActionCreators". Calling this props.signin therefor dispatches
  the signin action on the global state.
*/

const mapDispatchToProps = dispatch => bindActionCreators({ signin }, dispatch);


// const styles = StyleSheet.create({});

export default connect(null, mapDispatchToProps)(SigninScreen);

