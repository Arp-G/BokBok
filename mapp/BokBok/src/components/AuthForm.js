// import React, { useState } from 'react';
// import { StyleSheet } from 'react-native';
// import { Text, Button, Input } from 'react-native-elements';


// const AuthForm = ({ headerText, onSubmit, submitButtonText }) => {

//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [phone_number, setPhoneNumber] = useState('');

//     return (
//         <>
//             <Text h3>{headerText}</Text>
//             <Input label="Username"
//                 onChangeText={setUsername}
//                 autoCapitalize="none"
//                 autoCorrect={false} />
//             <Input label="Phone Number"
//                 onChangeText={setPhoneNumber}
//                 keyboardType={'phone-pad'}
//             />
//             <Input label="Password"
//                 onChangeText={setPassword}
//                 secureTextEntry
//             />
//             <Button
//                 title={submitButtonText}
//                 onPress={() => onSubmit({ username, phone_number, password })}
//             />
//         </>
//     );
// };


// export default AuthForm;
