import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import authStyles from '../styles/auth';

const SignupScreen = ({ signin }) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await bokbokApi.post('/sign_up', { username, email, phone_number, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('id', `${response.data.id}`);
      signin(response.data.token, response.data.id);
    } catch (err) {
      setError(err.response.data.errors);
      setLoading(false);
    }
  }

  return (

    <ImageBackground source={require('../assets/images/background.jpg')} style={{ width: '100%', height: '100%' }}>
      <KeyboardAwareScrollView contentContainerStyle={authStyles.form}>
        <>
          <Text style={authStyles.heading}>Sign Up for Bok Bok</Text>
          <Input
            label="Username"
            labelStyle={authStyles.label}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={{ type: 'font-awesome', name: 'user', color: 'navy' }}
            errorMessage={error["username"] ? error["username"].join(", ") : ""}
          />
          <Input
            label="Email"
            labelStyle={authStyles.label}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'navy' }}
            errorMessage={error["email"] ? error["email"].join(", ") : ""}
          />
          <Input
            label="Phone Number"
            labelStyle={authStyles.label}
            onChangeText={setPhoneNumber}
            keyboardType={'phone-pad'}
            leftIcon={{ type: 'font-awesome', name: 'phone-square', color: 'navy' }}
            errorMessage={error["phone_number"] ? error["phone_number"].join(", ") : ""}
          />
          <Input
            label="Password"
            labelStyle={authStyles.label}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={{ type: 'font-awesome', name: 'lock', color: 'navy' }}
            errorMessage={error["password"] ? error["password"].join(", ") : ""}
          />
          <NavLink
            routeName="Auth"
            nestedRoute={{ screen: 'SignIn' }}
            text="Already have an account? Sign in instead!"
          />
          <Button
            title="Sign Up !"
            onPress={onSubmit}
            loading={loading}
            buttonStyle={
              authStyles.button
            }
          />
        </>
      </KeyboardAwareScrollView>
    </ImageBackground>

  );
};

const mapDispatchToProps = dispatch => bindActionCreators({ signin }, dispatch);

export default connect(null, mapDispatchToProps)(SignupScreen);
