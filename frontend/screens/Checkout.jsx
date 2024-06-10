
import {  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../assets/colors/colors";
import Header from "../components/Header";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import { Divider } from 'react-native-elements';
import { Image } from 'react-native-elements';
import MBWAY from '../assets/MBWay.png'
import MB from '../assets/multibanco.webp'
import { useNavigation } from "@react-navigation/native";


const Checkout = () => {

    const navigation = useNavigation();

    const [startCheckout, setStartCheckout] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState();

    const handleStopParking = () =>{
        setStartCheckout(!startCheckout);
    }

    const handleGetTicket = () =>{
        navigation.navigate('NFCTicket')
    }

    return(  
    
    <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header/>
       
        <View style={styles.titleContainer}>
            <Text style={styles.title}>Checkout</Text>
        </View>
        <View style={styles.inputContainer}>
            <Text style={styles.text}>Current parking time: {''}</Text>
        </View>
        

        <View style={styles.inputContainer}>
           {startCheckout ? 
           <CustomButton title={'Parking Stopped'} color={colors.background} onPressFunction={handleStopParking} style={{borderColor: colors.orange, borderWidth: 1}}/> 
           : <CustomButton title={'Stop Parking'} color={colors.orange} onPressFunction={handleStopParking}/> }

        </View>
        {startCheckout ?
        <>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Parked time: {''}</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Price: {''}</Text>
            </View>

             <View style={styles.inputContainer}>
               <Divider width={2}/>
            </View> 

            <View style={styles.inputContainer}>
                <Text style={styles.text}>Choose Payment Method</Text>
            </View> 

            <View style={styles.paymentMethods}>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={MBWAY}/>
              </View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={MB}/>
              </View>
            </View> 

            <View style={styles.inputContainer}>
            <TextInput value={phoneNumber} style={styles.input} placeholderTextColor={colors.greyText} placeholder="Phone Number" 
            onChangeText={(text) => setPhoneNumber(text)} />

            </View>
            <Text style={styles.warningText}>You have 10 min after payment to leave the park</Text>


            <View style={styles.inputContainer}>
            <CustomButton title={'Get Ticket'} color={colors.orange} onPressFunction={handleGetTicket}/> 
            </View> 

</>

            : <></>
        }


    </ScrollView>
    </SafeAreaView>)

}
export default Checkout;


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingTop: 40,
        
       

    },


    scrollViewContent: {
        width: "100%",
        paddingHorizontal: 30,
        paddingBottom: 30,

    },
    title: {
        fontSize: 28,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        alignSelf: 'center'

    },
    text:{
        fontSize: 20,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        alignSelf: 'flex-start',
       
    },
    titleContainer:{
        marginTop: 20,

    },
    inputContainer:{
        marginTop: 30,
       
    },
    paymentMethods:{
        marginTop: 40,
        flexDirection: 'row',
        height:60,
    
      justifyContent: 'space-around'

    },
    imageContainer: {
        backgroundColor: colors.white,
        borderColor: colors.orange,
        borderWidth: 1,
        borderRadius: 10,
        padding:8,
        alignItems: 'center',
        justifyContent: 'center'
        
    },
    image: {
        height:50,
        width: 100,
        borderRadius: 10,
        resizeMode: 'contain'
    },
    input: {
        fontSize: 18,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.greyText,
        padding: 10,
        backgroundColor: colors.background,
        color: colors.white,
    },
    warningText:{
        marginTop: 30,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        color: colors.white,
       
    }

})