import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import colors from '../assets/colors/colors'


const CustomButton = ({ title, onPressFunction, color }) => {
  return (
    <TouchableOpacity
      onPress={onPressFunction}
      style={color ? ({ ...styles.button, backgroundColor: color }) : styles.button}
    >
      <View style={styles.contents}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton;

const styles = StyleSheet.create({

  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    paddingHorizontal: 10,
    shadowColor: "black",
    shadowOffset: {
      height: 3,
      width: 0,
    },
    shadowOpacity: 1.25,
    elevation: 3,
    height: 50,
  },
  contents:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonText: {
    textAlign: "center",
    color: colors.white,
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "semibold",
  }

})