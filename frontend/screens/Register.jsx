import { View, Text, Image, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, ScrollView, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { CustomButton } from '../components/CustomButton';
import LOGO from "./../assets/ParKingLogo.png";
import colors from '../assets/colors/colors';

const Register = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
                <ScrollView style={styles.scrollView}>
                    <Image style={styles.logo} source={LOGO} />
                    <Text style={styles.pageName}>Sing Up</Text>

                    <TextInput value={name} style={styles.input} placeholderTextColor={colors.greyText} placeholder="Name" autoCapitalize="none" onChangeText={(text) => setName(text)} />
                    <TextInput value={email} style={styles.input} placeholderTextColor={colors.greyText} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
                    <TextInput secureTextEntry={true} value={password} placeholderTextColor={colors.greyText} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)} />

                    <View style={styles.buttonView}>
                        {loading ? <ActivityIndicator size="large" color={colors.orange} />
                            : (
                                <CustomButton title="Register" onPressFunction={signUp} color={colors.orange} />
                            )
                        }
                    </View>
                    <View style={styles.loginView}>
                        <Text style={{ color: colors.greyText }}>Already a member? </Text>
                        <Text style={{ color: colors.white, textDecorationLine: 'underline' }} onPress={() => navigation.navigate('Login')}>Log in!</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
    },
    scrollView: {
        width: "100%"
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 120,
        marginTop: 50,
    },
    pageName: {
        fontSize: 40,
        fontFamily: 'League Spartan',
        fontWeight: '600',
        color: colors.white,
        alignSelf: 'flex-start',
        paddingBottom: 30
    },
    keyboardAvoidingView: {
        height: '100%',
        width: '100%'
    },
    input: {
        marginVertical: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.orange,
        padding: 10,
        backgroundColor: colors.background,
        color: colors.white,
    },
    buttonView: {
        paddingTop: 40
    },
    loginView: {
        justifyContent: "center",
        flexDirection: "row",
        marginVertical: 30

    }
})