import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../assets/colors/colors";
import Header from "../components/Header";
import { useState } from "react";
import CustomButton from "../components/CustomButton";



const Help = () => {

const [problemDescription, setProblemDescription] = useState();


const handleSendReport = () =>{

}

    
    return(  
    
        <SafeAreaView style={styles.container}>
            <Header/>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Report the problem here!</Text>
            </View>
            <View style={styles.inputContainer}>

                <TextInput 
                value={problemDescription} 
                style={styles.input} 
                placeholderTextColor={colors.greyText} 
                placeholder="Write here..." autoCapitalize="none" 
                onChangeText={(text) => setProblemDescription(text)} 
                multiline
                numberOfLines={10}
                
                />

            </View>
            <View style={styles.inputContainer}>
            <CustomButton title={'Send Report'} color={colors.orange} onPressFunction={handleSendReport}/>

            </View>
    
        </SafeAreaView>)


}


export default Help;


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        alignSelf: 'flex-start',

    },
    input: {
        textAlignVertical: 'top',
        fontSize: 18,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.orange,
        backgroundColor: colors.background,
        color: colors.white,
        padding: 20,
       
    },
    inputContainer:{
        marginTop: 40,
       
    }

})