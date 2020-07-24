import React, { useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import ErrorList from '../components/ErrorList';

const SignupScreen = ({ signin, navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState({});


  const onSubmit = async ({ username, phone_number, password }) => {

    try {

      const reponse = await bokbokApi.post('/sign_up', { username, phone_number, password });

      await AsyncStorage.setItem('token', reponse.data.token);
      console.log(reponse.data.token);
      signin(reponse.data.token);
      navigation.navigate('Main', { screen: 'Accounts' });
    } catch (err) {
      setError(err.response.data.errors);
    }

  }

  return (
    <View>
      <>
        <Text h3>Sign Up for Bok Bok</Text>
        <Input label="Username"
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false} />
        {error["username"] ? (<ErrorList field="Username" data={error["username"]} />) : null}


        <Input label="Phone Number"
          onChangeText={setPhoneNumber}
          keyboardType={'phone-pad'}
        />
        {error["phone_number"] ? (<ErrorList field="Phone number" data={error["phone_number"]} />) : null}
        <Input label="Password"
          onChangeText={setPassword}
          secureTextEntry
        />
        {error["password"] ? (<ErrorList field="Password" data={error["password"]} />) : null}
        <NavLink
          routeName="Auth"
          nestedRoute={{ screen: 'SignIn' }}
          text="Already have an account? Sign in instead!"
        />
        <Button
          title="Sign Up !"
          onPress={() => onSubmit({ username, phone_number, password })}
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

export default connect(null, mapDispatchToProps)(SignupScreen);

