import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import colors from '../assets/colors/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';


const InputPicker = ({ title, auxFunction, date }) => {
    const displayDate = title === 'Date'
        ? date.toLocaleDateString()
        : date.toLocaleTimeString();

    return (
        <View style={styles.componentsViews}>
            <Text style={styles.componentsTitle}>{title}</Text>
            <TouchableOpacity style={styles.input} onPress={auxFunction}>
                <Text style={styles.inputText}>{displayDate}</Text>
                <FontAwesome name="caret-down" size={15} color={colors.greyText} />
            </TouchableOpacity>
        </View>
    );
}

export default InputPicker;

const styles = StyleSheet.create({
    componentsViews: {
        width: "auto",
        marginTop: 30,
        flex: 1,
        paddingHorizontal: 5,
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
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.greyText,
        marginBottom: 10,
        height: 50,
    },
    inputText: {
        color: colors.secondaryText,
        fontSize: 16,
    },
})