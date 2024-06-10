import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from '../assets/colors/colors';
import Header from "../components/Header";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';


const HomePage = () => {

    const navigation = useNavigation();


    const startParking = () => {

    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header />
                <View style={styles.titleContainer}>
                    <Text style={styles.menuTitle}>Hello Jack</Text>
                    <FontAwesome5 name="car" size={50} color={colors.white} />
                </View>
                <View style={styles.menuContainer}>
                    <CustomButton title="Start Parking" onPressFunction={startParking} color={colors.orange} />
                    <View style={styles.menuContainer}>
                        <Text style={styles.menuSubtitle}>Bookings</Text>
                        <TouchableOpacity
                            onPress={'onPressFunction'}
                            style={({ ...styles.button, backgroundColor: colors.grey })}
                        >
                            <View style={styles.contents}>
                                <Text style={styles.buttonText}>{'title'}</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>

    );
}

export default HomePage;

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
    },

    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 40,
    },

    scrollView: {
        width: "100%"
    },

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

    menuTitle: {
        fontSize: 30,
        fontFamily: 'League Spartan',
        fontWeight: '700',
        color: colors.white,
        alignSelf: 'flex-start',

    },
    menuSubtitle: {
        fontSize: 24,
        fontFamily: 'League Spartan',
        fontWeight: 'regular',
        color: colors.white,
        alignSelf: 'flex-start',
    },
    titleContainer: {
        width: "100%",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 45,


    },
    menuContainer: {
        marginTop: 35,
        flex: 1
    }

})