import { Image, StyleSheet, View } from "react-native";
import LOGO from "../assets/ParKingLogo.png"
import { FontAwesome } from '@expo/vector-icons';

const Header = () => {
    return (<View style={styles.header}>
        <Image style={styles.logo} source={LOGO} />
        <FontAwesome name="user-circle" size={24} color="white" />
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },

})