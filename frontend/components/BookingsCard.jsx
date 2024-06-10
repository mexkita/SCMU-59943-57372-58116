import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import colors from '../assets/colors/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider } from 'react-native-elements';



export const BookingsCard = ({ parkingLot, date, hour, onPressFunction }) => {
    return(
    <TouchableOpacity
        onPress={'onPressFunction'}
        style={({ ...styles.button, backgroundColor: colors.grey })  }
    >
       <View style={styles.contentLeft}>
            <FontAwesome5 name="parking" size={50} color={colors.white} />
            <Divider orientation="vertical" width={1} inset={false} color={colors.greyText}/>
       </View>
       <View style={styles.contentMiddle}>
            <Text style={styles.buttonText }>{'Parking Lot y'}</Text>
            <Text style={styles.buttonText }>{'15/05/2024'}</Text>
       </View>
       <View style={styles.contentRight}>
        <Text style={styles.buttonText }>{'12h30'}</Text>
       </View>
      
        
    </TouchableOpacity>)
}


const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: "center",
        padding: 2,
        shadowColor: "black",
        shadowOffset: {
            height: 3,
            width: 0,
        },
        shadowOpacity: 1.25,
        elevation: 3,
        height: 115,
    },
    contentLeft: {
        height: 115,
        width: 70,
        flexDirection: 'row',
        marginLeft: 20,
        justifyContent: 'space-between',
        alignItems: "center",

    },
    contentMiddle:{
        height: 115,
        justifyContent: 'space-between',
        paddingVertical: 10,

    },
    contentRight:{
        height: 115,
        justifyContent: 'flex-end',
        paddingBottom: 10,
        paddingEnd: 10
    },
  

    buttonText: {
        color: colors.white,
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: "regular",
    },

})