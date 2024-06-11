// import { useNavigation } from "@react-navigation/native";
// import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
// import colors from "../assets/colors/colors";
// import { AntDesign } from '@expo/vector-icons';
// import Header from "../components/Header";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useEffect, useState } from "react";
// import NfcManager, { NfcTech, nfcManager } from 'react-native-nfc-manager';




// const NFCTicket = () => {
//     const navigation = useNavigation();

//     const [isRead, setIsRead] = useState(false);
  

//     const handleRead = () =>{
//         setIsRead(true);
//         navigation.navigate('Home');
//     }

//     useEffect(() => {


//         hasSupportNFC();
//     }, [])

    
//     const readNfc = async () => {

//         try {
         
//             await nfcManager.requestTechnology([NfcTech.Ndef]);

//             const tag = await nfcManager.getTag()

//             if(tag){
//                 const status = await nfcManager.ndefHandler.getNdefStatus();

//                 console.log(tag, status)
//             }
        
//         } catch (ex) {

//           console.warn(ex);

//         } finally {
//           // STEP 4
//           NfcManager.cancelTechnologyRequest();
//         }
      
//         // return mifarePages;
//     }
    

//     const hasSupportNFC = async () => {

//         const supported = await nfcManager.isSupported();
//         console.log(supported)

//         if(!supported){
//             console.log('Not supoorted');
//             setTimeout(() => {
//                 setIsRead(false)
//             }, 100)
//             return;
//         }
//         await nfcManager.start();
//         console.log(nfcManager.start())

//         readNfc();

//     }

//     return(
//         <SafeAreaView style={styles.container}>
//             <Header/>
//             <View style={{marginTop: 30}}>
//                {isRead ?  <AntDesign name="checkcircle" size={80} color={colors.orange}/>:<AntDesign name="checkcircleo" size={80} color={colors.orange} /> }
//             </View>

            
//             <View style={styles.ticketCard}>
//                 <Text style={styles.ticketText}>Ticket</Text>
//             </View>


//             <View style={styles.instruction}>
//                 <MaterialCommunityIcons name="nfc" size={24} color={colors.white} style={{paddingRight: 10,}}/>
//                 <Text style={styles.ticketText}>Hold to reader</Text>
//             </View>

//         </SafeAreaView>
//     )

// }

// export default NFCTicket;


// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: colors.background,
//         paddingHorizontal: 30,
//         flex: 1,
//         paddingTop: 40,
//         alignItems: 'center'
//     },
//     ticketCard:{
//         height: 170,
//         width: 320,
//         backgroundColor: colors.orange,
//         borderRadius: 10,
//         padding: 20,
//         marginTop: 35
        
//     },
//     ticketText:{
//         color: colors.white,
//         fontSize: 20
//     },
//     instruction:{
//         flexDirection: 'row',
        
//         marginTop: 35,
        
//     }

// })

// import { useNavigation } from "@react-navigation/native";
// import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors/colors";
import { AntDesign } from '@expo/vector-icons';
import Header from "../components/Header";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
// import NfcManager, { NfcTech, nfcManager } from 'react-native-nfc-manager';
import React from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

// Pre-step, call this before any NFC operations
NfcManager.start();

function NFCTicket() {

    const [isRead, setIsRead] = useState(false);

    useEffect(() =>{
        readNfc();
    }, [])

async function readNfc() {
    let mifarePages = [];
  
    try {
      // STEP 1
      
      let reqMifare = await NfcManager.requestTechnology(
        NfcTech.MifareUltralight,
      );
  
      console.log("STEP 1")
      console.log(reqMifare)

      const readLength = 60;
      const mifarePagesRead = await Promise.all(
        [...Array(readLength).keys()].map(async (_, i) => {
          const pages = await NfcManager.mifareUltralightHandlerAndroid // STEP 2
            .mifareUltralightReadPages(i * 4); // STEP 3
          mifarePages.push(pages);
        }),
      );

      console.log("STEP 2")
      console.log(mifarePagesRead)
      setIsRead(true);

    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
      console.log("CANCEL")
    }
  
    return mifarePages;
  }

    return(
        <SafeAreaView style={styles.container}>
            <Header/>
            <View style={{marginTop: 30}}>
                {isRead ?  <AntDesign name="checkcircle" size={80} color={colors.orange}/>:<AntDesign name="checkcircleo" size={80} color={colors.orange} /> }
            </View>

            
            <View style={styles.ticketCard}>
                <Text style={styles.ticketText}>Ticket</Text>
            </View>


            <View style={styles.instruction}>
                <MaterialCommunityIcons name="nfc" size={24} color={colors.white} style={{paddingRight: 10,}}/>
                <Text style={styles.ticketText}>Hold to reader</Text>
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 40,
        alignItems: 'center'
    },
    ticketCard:{
        height: 170,
        width: 320,
        backgroundColor: colors.orange,
        borderRadius: 10,
        padding: 20,
        marginTop: 35
        
    },
    ticketText:{
        color: colors.white,
        fontSize: 20
    },
    instruction:{
        flexDirection: 'row',
        
        marginTop: 35,
        
    }

})

export default NFCTicket;