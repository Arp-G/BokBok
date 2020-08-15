import React from 'react';
import { View, ImageBackground } from 'react-native';
import { Text } from 'react-native-elements';

export default ({ text }) => {

    return (
        <View>
            <ImageBackground
                source={require('../assets/images/empty-page-background.jpg')}
                style={{ width: '100%', height: '100%' }}>
                <Text style={{
                    fontSize: 30,
                    fontFamily: 'cursive',
                    marginTop: '50%',
                    alignSelf: 'center',
                    padding: 20
                }}> {text} </Text>
            </ImageBackground>
        </View>

    );
}