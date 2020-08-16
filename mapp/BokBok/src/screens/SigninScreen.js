import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ImageBackground, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';
import ErrorList from '../components/ErrorList';

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
      <View style={styles.form}>
        <>
          <Text h3 h3Style={styles.heading}>Sign In to Bok Bok</Text>
          <Input label="Username"
            labelStyle={styles.label}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={{ type: 'font-awesome', name: 'user', color: 'navy' }}
          />
          <Input label="Password"
            labelStyle={styles.label}
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
            buttonStyle={
              styles.button
            }
          />
        </>
      </View>
    </ImageBackground>
  );
};


/*
  signin is an action, which we import from "actions/auth", through mapDispatchToProps we provide a props.signin function
  to this component, this version of signin is created by "bindActionCreators". Calling this props.signin therefor dispatches
  the signin action on the global state.
*/

const mapDispatchToProps = dispatch => bindActionCreators({ signin }, dispatch);


const styles = StyleSheet.create({
  button: {
    width: 200,
    marginLeft: 15,
    marginTop: 30
  },
  form: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    marginBottom: 100
  },
  heading: {
    color: 'black',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 50
  },
  label: {
    color: 'black'
  }
});

export default connect(null, mapDispatchToProps)(SigninScreen);

