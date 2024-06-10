import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import colors from '../assets/colors/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const HomeButtons = ({ title, icon, onPressFunction }) => {

    return (
        <TouchableOpacity
          onPress={onPressFunction}
          style={({ ...styles.button, backgroundColor: colors.grey })  }
        >
          <View style={styles.contents}>
          
          <MaterialCommunityIcons name={icon} size={24} color={colors.white} />
          <Text style={styles.buttonText }>{title}</Text>
          <View style={styles.contentDisplayment}>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={colors.white} />
            </View>
          </View>
    
        </TouchableOpacity>
      )



}


const styles = StyleSheet.create({

    button: {
        borderRadius: 10,
        justifyContent: "center",
        padding: 2,
        paddingHorizontal: 10,
        marginBottom: 20,
        shadowColor: "black",
        shadowOffset: {
            height: 2,
            width: 0,
        },
        shadowOpacity: 1.25,
        elevation: 3,
        height: 50,
    },
    contents:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentDisplayment:{
   
        flex: 1,
        alignItems:  'flex-end',
        justifyContent: 'flex-end'
       
    },

    buttonText: {
        textAlign: "center",
        color: colors.white,
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: "semibold",
        paddingHorizontal: 20

    }

})