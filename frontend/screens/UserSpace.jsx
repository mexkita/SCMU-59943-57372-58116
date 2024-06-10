import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors/colors";
import Header from "../components/Header";
import CustomButton from "../components/CustomButton";


const UserSpace = () => {


   const  handleLogout = () =>{

    }

return(
    <SafeAreaView style={styles.container}>
        <Header/>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>My page</Text>
        </View>
        <View style={styles.titleContainer}>
            <View style={styles.info}>
            <Text style={styles.infoTitle}>Name:</Text>
            <Text style={styles.infoText}>{'eafg'}</Text>

            </View>
            <View style={styles.info}>
            <Text style={styles.infoTitle}>Email:</Text>
            <Text style={styles.infoText}>{'eafg'}</Text>
            </View>

        </View>


        <View style={styles.buttonContainer}>
        <CustomButton title={'Logout'} color={colors.orange} onPressFunction={handleLogout}/>
        </View>
        
    </SafeAreaView>
)


}

export default UserSpace;


const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.background,
        paddingHorizontal:30,
        flex: 1,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        alignSelf: 'center'

    },
    titleContainer:{
        marginTop: 20,

    },
    buttonContainer:{
        marginTop: 40,

    },
    info:{

        flexDirection: 'row',
        marginBottom:10

    },
    infoTitle:{
        fontSize: 20,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        paddingRight: 10
       
    },
    infoText:{
        fontSize: 20,
        fontFamily: 'League Spartan',
        fontWeight: '500',
        color: colors.white,
       
    }
})