import React, { useState, useEffect } from 'react';
import { View, ImageBackground, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import ErrorList from '../components/ErrorList';
import authStyles from '../styles/auth';

const SigninScreen = ({ signin, navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearState = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
  }

  useEffect(() => {
    const removeListener = navigation.addListener('blur', () => {
      clearState();
    });

    return removeListener; // Remove listener
  });


  const onSubmit = async ({ username, password }) => {

    try {
      setLoading(true);
      const response = await bokbokApi.post('/sign_in', { username, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('id', `${response.data.id}`);
      signin(response.data.token, response.data.id);
    } catch (err) {
      ToastAndroid.showWithGravity(
        "Signin Failed !",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
      setLoading(false);
      setError('Wrong username or password !');
    }

  }

  return (
    <ImageBackground source={require('../assets/images/background.jpg')} style={{ width: '100%', height: '110%' }}>
      <View style={authStyles.form}>
        <>
          <Text h3 h3Style={authStyles.heading}>Sign In to Bok Bok</Text>
          <Input label="Username"
            labelStyle={authStyles.label}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={{ type: 'font-awesome', name: 'user', color: 'navy' }}
          />
          <Input label="Password"
            labelStyle={authStyles.label}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={{ type: 'font-awesome', name: 'lock', color: 'navy' }}
          />
          {error ? (<ErrorList data={[error]} />) : null}
          <NavLink
            routeName="Auth"
            nestedRoute={{ screen: 'SignUp' }}
            text="Don't have an account? Sign up now!"
          />
          <Button
            title="Sign In !"
            onPress={() => onSubmit({ username, password })}
            loading={loading}
            buttonStyle={authStyles.button}
          />
        </>
      </View>
    </ImageBackground>
  );
};

const mapDispatchToProps = dispatch => bindActionCreators({ signin }, dispatch);

export default connect(null, mapDispatchToProps)(SigninScreen);
