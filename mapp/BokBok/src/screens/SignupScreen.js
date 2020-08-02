import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, Button, Input } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import bokbokApi from '../api/bokbok';
import { signin } from '../actions/auth';
import { connect } from 'react-redux';
import NavLink from '../components/NavLink';

const SignupScreen = ({ signin, navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {

    try {
      setLoading(true);
      const response = await bokbokApi.post('/sign_up', { username, phone_number, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('id', `${response.data.id}`);
      signin(response.data.token, response.data.id);
      navigation.navigate('Main', { screen: 'AccountsFlow' });
    } catch (err) {
      setError(err.response.data.errors);
      setLoading(false);
    }

  }

  return (
    <ImageBackground source={require('../assets/images/background.jpg')} style={{ width: '100%', height: '110%' }}>
      <View style={styles.form}>
        <>
          <Text h3 h3Style={styles.heading}>Sign Up for Bok Bok</Text>
          <Input
            label="Username"
            labelStyle={styles.label}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={{ type: 'font-awesome', name: 'user', color: 'navy' }}
            errorMessage={error["username"] ? error["username"].join(", ") : ""}
          />
          <Input
            label="Phone Number"
            labelStyle={styles.label}
            onChangeText={setPhoneNumber}
            keyboardType={'phone-pad'}
            leftIcon={{ type: 'font-awesome', name: 'phone-square', color: 'navy' }}
            errorMessage={error["phone_number"] ? error["phone_number"].join(", ") : ""}
          />
          <Input
            label="Password"
            labelStyle={styles.label}
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

export default connect(null, mapDispatchToProps)(SignupScreen);
