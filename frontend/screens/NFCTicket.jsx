import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors/colors";
import { AntDesign } from '@expo/vector-icons';
import Header from "../components/Header";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";



const NFCTicket = () => {
    const navigation = useNavigation();

   const [isRead, setIsRead] = useState(false);
  

    const handleRead = () =>{
        setIsRead(true);
        navigation.navigate('Home');
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

export default NFCTicket;


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