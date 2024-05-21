import { View, Text, Image, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import LOGO from "./../assets/ParKingLogo.png";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {

            const response = await signInWithEmailAndPassword(auth, email, password)

        } catch (error) {
            console.log(error)
            alert("Sign in failed: " + error.message)
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert("Account Created!")
        } catch (error) {
            console.log(error);
            alert("Sign Up failed: " + error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={LOGO} />
            </View>
            <Text style={styles.pageName}>Login</Text>
            <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
                
                    <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} />

                {loading ? <ActivityIndicator size="large" color="#0000ff" />
                    : (
                        <>
                            <Button title="Login" onPress={signIn} style={styles.button}/>
                            <Button title="Create Account" onPress={signUp} />
                        </>
                    )
                }
            </KeyboardAvoidingView>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#292929",
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        marginBottom: 80,
    },
    pageName: {
        fontSize: 40,
        fontFamily: 'League Spartan',
        fontWeight: '600',
        color: '#fff',
        alignSelf: 'flex-start'
    },
    keyboardAvoidingView: {
        borderWidth: 1, 
        borderColor: '#0f0', 
        width: '100%'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff',
    },
    button: {
        borderRadius: 5,
    }
})