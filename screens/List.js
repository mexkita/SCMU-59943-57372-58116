import { View, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const List = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign Out" />
        </View>
    );
}

export default List;
