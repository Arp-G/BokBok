import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
var Spinner = require('react-native-spinkit');

const SplashScreen = () => (
  <View style={styles.splash}>
    <Text style={styles.title}> Bok Bok !</Text>
    <Spinner style={styles.spinner} isVisible={true} size={100} type={'9CubeGrid'} color='#d35400' />
    <Text style={styles.author}> ... by Arpan</Text>
  </View>
);

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626'
  },
  spinner: {
    paddingTop: 200
  },
  title: {
    fontSize: 60,
    color: 'white',
    fontFamily: 'cursive',
    fontWeight: 'bold'
  },
  author: {
    fontSize: 20,
    color: 'red',
    fontStyle: 'italic',
    fontWeight: 'bold'
  }
});

export default SplashScreen;
