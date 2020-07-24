import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';

export default ({ field, data }) => {

    return (
        <FlatList
            data={data}
            keyExtractor={item => item}
            renderItem={
                ({ item }) => (<Text style={styles.error}> {field ? `${field} ${item}` : item}</Text>)
            }
        />
    );
};

const styles = StyleSheet.create({
    error: {
        color: 'red',
        marginLeft: 20,
        marginBottom: 10
    }
});
