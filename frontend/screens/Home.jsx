import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from '../assets/colors/colors';
import Header from "../components/Header";
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { BookingsCard } from "../components/BookingsCard";
import { HomeButtons } from "../components/HomeButtons";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthProvider";
import { usersApi } from "../api";


const Home = () => {

    const navigation = useNavigation();

    const { user } = useAuth()

    const [reservation, setReservation] = useState({ title: '', startDate: new Date() })


    const startParking = () => {
        navigation.navigate('NFCTicket');
        //startParkingRequest()
    }

    const startParkingRequest = async () => {

        try {
            await usersApi.startParking(user.id, '012345')
            alert("Started parking!");
        } catch (error) {
            console.log("[" + error.response.status + "] " + error.response.data.message)
            alert(error.response.data.message)
        }

    }


    useEffect(() => {
        getReservation();
    }, []);

    const getReservation = async () => {

        try {
            const reservations = await usersApi.getReservationsByUser(user.id)
            setReservation({ title: reservations.title, startDate: new Date(reservations.start_date) });
            console.log(reservation.startDate)
        } catch (err) {
            console.log(err)
        }

    }

    const handleNavigation = (pageName) => {
        navigation.navigate(pageName);
    }

    const handleReservedBook = () => {
        navigation.navigate('NFCTicket');
    }


    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}h${minutes < 10 ? '0' : ''}${minutes}`; // Add leading zero if minutes are less than 10
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header />
                <View style={styles.titleContainer}>
                    <Text style={styles.menuTitle}>Hello {user?.displayName}</Text>
                    <FontAwesome5 name="car" size={50} color={colors.white} />
                </View>
                <View style={styles.menuContainer}>
                    <CustomButton title="Start Parking" onPressFunction={startParking} color={colors.orange} />
                    <View style={styles.menuContainer}>
                        <Text style={styles.menuSubtitle}>Bookings</Text>
                        <BookingsCard
                            onPressFunction={handleReservedBook}
                            parkingLot={reservation.title}
                            date={formatDate(reservation.startDate)}
                            hour={formatTime(reservation.startDate)}
                        />
                    </View>
                    <View style={styles.menuContainer}>
                        <Text style={styles.menuSubtitle}>Utilities</Text>
                        <HomeButtons title={'Search for parking lots'} icon={'map-marker-outline'} onPressFunction={() => handleNavigation('SearchParking')} />
                        <HomeButtons title={'Book Parking spot'} icon={'bookmark-outline'} onPressFunction={() => handleNavigation('BookParkingSpot')} />
                        <HomeButtons title={'Checkout'} icon={'wallet-outline'} onPressFunction={() => handleNavigation('Checkout')} />
                        <HomeButtons title={'Help'} icon={'help-circle-outline'} onPressFunction={() => handleNavigation('Help')} />

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>

    );
}

export default Home;

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingTop: 40,
    },

    scrollView: {
        width: "100%",
        paddingHorizontal: 30,
        paddingBottom: 30,

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
        paddingBottom: 20,
    },
    titleContainer: {
        width: "100%",
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 35,


    },
    menuContainer: {
        marginTop: 35,
        flex: 1
    },


})