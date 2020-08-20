import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default ({ text, routeName, nestedRoute } = props) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onPress={() => navigation.navigate(routeName, nestedRoute)}>
            <Text style={styles.link}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    link: {
        marginTop: -5, 
        color: 'blue',
        marginLeft: 20
    }
});
