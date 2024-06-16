import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import LOGO from '../assets/logo.png'
import colors from "../assets/colors/colors";
import { useNavigation } from "@react-navigation/native";

const Header = () => {

const navigation = useNavigation();

   const handleUserProfile = () =>{
        navigation.navigate('UserSpace');
   }

   const goHome = () => {
    navigation.navigate('Home');
   }


    return (<View style={styles.header}>
        <TouchableOpacity onPress={goHome}>
        <Image style={styles.logo} source={LOGO} />
      </TouchableOpacity>
        <FontAwesome name="user-circle" size={30} color="white" onPress={handleUserProfile}/>
    </View>)

}

export default Header;

const styles = StyleSheet.create({


    logo: {
        width: 116,
        height: 51,
    },
    header: {
        width: "100%",
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       

    },

   

})