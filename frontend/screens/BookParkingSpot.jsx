import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import colors from '../assets/colors/colors';
import Header from "../components/Header";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import InputPicker from '../components/InputPicker';
import CustomButton from '../components/CustomButton';
import { Picker } from '@react-native-picker/picker';

const BookParkingSpot = () => {
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedParkingLot, setParkingLot] = useState();

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
                            {/* TODOOOOO list parking lots from backend */}
                            <Picker.Item label="FCT Lidl" value="fct lidl" />
                            <Picker.Item label="FCT Dep" value="fct dep" />
                            <Picker.Item label="FCT main avenue" value="fct main" />
                            <Picker.Item label="FCT DI" value="fct di" />
                        </Picker>
                    </View>

                    <InputPicker title="Date" auxFunction={showDatepicker} date={startDate} />
                    <View style={styles.startAndEndTimeView}>
                        <InputPicker title="Start Time" auxFunction={() => showTimepicker(true)} date={startDate} />
                        <InputPicker title="End Time" auxFunction={() => showTimepicker(false)} date={endDate} />
                    </View>
                    <View style={styles.bookButtonView}>
                        {/* TODOOOOO connect to firebase */}
                        <CustomButton title="Book Spot" onPressFunction={printDatesDebug} color={colors.orange} />
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
