import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import colors from "../assets/colors/colors";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { parkApi } from "../api";
import { Picker } from '@react-native-picker/picker';



const Help = () => {

const [problemDescription, setProblemDescription] = useState();
const [parkingLots, setParkingLots] = useState([])
const [selectedParkId, setSelectedParkId] = useState();



const handleSendReport = () =>{

reportProblem();

}



    useEffect(() => {
        getAllParkings();
    }, []);

    const getAllParkings = async () => {

        try {
            const parkingLots = await parkApi.getAllParks()
            setParkingLots(parkingLots)
        } catch (err) {
            console.log(err)
        }

    }

    const handleSelectPark = (parkId, itemIndex) => {
        console.log("Selected Park ", parkId)
        setSelectedParkId(parkId)
    }


const reportProblem = async () => {

    try {
        await parkApi.reportProblem(selectedParkId ,{message: problemDescription  })
        alert("Problem Reported!");
    } catch (error) {
        console.log("[" + error.response.status + "] " + error.response.data.message)
        alert(error.response.data.message)
    }

}


    
    return(  
    
        <SafeAreaView style={styles.container}>
            <Header/>
            <View style={styles.inputContainer}>
                <Text style={styles.title}>Report the problem here!</Text>
            </View>

            <View style={styles.parkingLotPickerView}>
                        <Picker
                            selectedValue={selectedParkId}
                            style={styles.parkingLotPicker}
                            dropdownIconColor={colors.greyText}
                            onValueChange={handleSelectPark}>

                            {parkingLots && parkingLots.map((park) => (
                                <Picker.Item key={park.parkId} label={park.title} value={park.parkId} />
                            ))
                            }

                        </Picker>
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
        paddingBottom: 20,


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
       
    },
    parkingLotPickerView: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.greyText,
        margin: 5,
        justifyContent: 'center',
    },
    parkingLotPicker: {
        color: colors.secondaryText,
        height: 50,
    },

})