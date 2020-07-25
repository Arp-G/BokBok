import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';

export default ({ field, data }) => {

    console.log(data);

    return (
        <FlatList
            data={data}
            keyExtractor={item => item}
            renderItem={
                ({ item }) => (<Text style={styles.error}> {field ? `${field} ${item}` : item}</Text>)
            }
            style={styles.errorList}
        />
    );
};

const styles = StyleSheet.create({
    errorList: {
        maxHeight: 50,
        flexGrow: 0
    },
    error: {
        color: 'red',
        marginLeft: 20,
        marginBottom: 10,
    }
});
