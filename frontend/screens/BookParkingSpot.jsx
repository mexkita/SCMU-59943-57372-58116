import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/colors';
import Header from "../components/Header";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import InputPicker from '../components/InputPicker';
import CustomButton from '../components/CustomButton';
import { Picker } from '@react-native-picker/picker';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from '../FirebaseConfig'; 

const BookParkingSpot = ({route}) => {
    const navigation = useNavigation();
    const {park} = route.params || {};

  
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedParkingLot, setParkingLot] = useState(park ? park.title: '');
    //const [parkingLots, setParkingLots] = useState();
    const [userId, setUserId] = useState(null);

   /* useEffect(() => {
        const auth = getAuth(FIREBASE_AUTH);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                navigation.navigate('Login'); // Redirect to login if no user is logged in
            }
        });

        return () => unsubscribe();
    }, []);*/

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
        if (selectedDate > endDate || !endDate)
            setEndDate(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate; // Updated
        if (selectedDate >= startDate || !startDate) // Updated condition
            setEndDate(currentDate);
    };

    const showMode = (currentMode, isStart) => {
        if (isStart) {
            DateTimePickerAndroid.open({
                value: startDate,
                onChangeStartDate,
                mode: currentMode,
                is24Hour: true,
                display: "spinner",
            });
        } else {
            DateTimePickerAndroid.open({
                value: endDate,
                onChangeEndDate,
                mode: currentMode,
                is24Hour: true,
                display: "spinner",
            });
        }

    };

    const handleChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
        setEndDate(currentDate);
    }

    const showDatepicker = () => {
        const mode = 'date';
        DateTimePickerAndroid.open({
            value: startDate,
            onChange: handleChangeDate,
            mode,
            is24Hour: true,
            display: "spinner",
        });
    };

    const showTimepicker = (isStart) => {
        const mode = 'time';
        const callback = isStart ? onChangeStartDate : onChangeEndDate;
        const value = isStart ? startDate : endDate;
        DateTimePickerAndroid.open({
            value,
            onChange: callback,
            mode,
            is24Hour: true,
            display: "spinner",
        });
    };

    const printDatesDebug = () => {
        console.log("------------- start date: " + startDate);
        console.log("------------- end date: " + endDate);
    }


    const parkingLots = [
        {
            id: 0,
            latitude: 38.72249845287284,
            longitude: -9.137780372648901 ,
            title: 'Parking Lot x',
            totalSlots: 200,
            availableSlots: 100,
            reservedAvailable: 20,
            pricePerHour: '0.5'

        },
        {
            id: 1,
            latitude: 38.66192985095062, 
            longitude: -9.205607571001307 ,
            title: 'Parking Lot FCT',
            totalSlots: 200,
            availableSlots: 150,
            reservedAvailable: 20,
            pricePerHour: '0.7'

        }
    ]


    const handleBookSpot = async () => {
        if (!userId) {
            Alert.alert("Error", "User not authenticated.");
            return;
        }
        // Check parking lots request
        const parkingLot = parkingLots.find(lot => lot.title === selectedParkingLot);
        if (!parkingLot) {
            console.log("Error", "Please select a valid parking lot.");
            return;
        }

        const payload = {
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
        };

        try {
            const response = await fetch(`https://your-backend-url/api/park/${parkingLot.id}/users/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to book parking spot');
            }

            const data = await response.json();
            console.log("Success", "Parking spot booked successfully!");
            // Optionally, navigate to another screen or update the UI
        } catch (error) {
            console.log("Error", error.message);
        }
    };



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header />
                <View style={styles.pageGlobalView}>
                    <Text style={styles.pageTitle}>Book Parking Spot</Text>
                    <Text style={styles.parkingLotTitle}>Parking Lot</Text>
                    <View style={styles.parkingLotPickerView}>
                        <Picker
                            selectedValue={selectedParkingLot}
                            style={styles.parkingLotPicker}
                            dropdownIconColor={colors.greyText}
                            onValueChange={(itemValue, itemIndex) =>
                                setParkingLot(itemValue)
                            }>
                               
                            {/* TODOOOOO list parking lots from backend */

                          
                            parkingLots.map((park) =>(
                                
                                <Picker.Item key={park.id} label={park.title} value={park.title} />
                                

                            ))
                            
                            }
                           
                        </Picker>
                    </View>

                    <InputPicker title="Date" auxFunction={showDatepicker} date={startDate} />
                    <View style={styles.startAndEndTimeView}>
                        <InputPicker title="Start Time" auxFunction={() => showTimepicker(true)} date={startDate} />
                        <InputPicker title="End Time" auxFunction={() => showTimepicker(false)} date={endDate} />
                    </View>
                    <View style={styles.bookButtonView}>
                        {/* TODOOOOO connect to firebase */}
                        <CustomButton title="Book Spot" onPressFunction={handleBookSpot} color={colors.orange} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookParkingSpot;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 40,
    },
    scrollView: {
        width: "100%",
    },
    pageGlobalView: {
        paddingTop: 45,
    },
    pageTitle: {
        color: colors.white,
        fontSize: 30,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        alignSelf: 'flex-start',
        alignSelf: "center",
        marginBottom: 30,
    },
    parkingLotTitle: {
        color: colors.white,
        marginLeft: 8,
        marginBottom: 8,
        fontSize: 18
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
    startAndEndTimeView: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    componentsViews: {
        width: "auto",
        marginTop: 30,
    },
    componentsTitle: {
        color: colors.white,
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.background,
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: colors.greyText,
        marginBottom: 10,
        height: 50,
    },
    inputText: {
        color: colors.secondaryText,
        fontSize: 16,
    },
    bookButtonView: {
        marginTop: 50
    }
});
