import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from '../assets/colors/colors';
import { Header } from "../components/Header";
import { FontAwesome5 } from '@expo/vector-icons';
import { CustomButton } from '../components/CostumButton';
import { BookingsCard } from "../components/BookingsCard";
import { HomeButtons } from "../components/HomeButtons";
import { useNavigation } from "@react-navigation/native";

const Home = () => {

    const navigation = useNavigation();

    const startParking =  () => {

    }

    const handleNavigation =  (pageName) => {
        navigation.navigate(pageName);
    }




return(
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <Header/>
            <View style={styles.titleContainer}>
                <Text style={styles.menuTitle}>Hello Jack</Text>
                <FontAwesome5 name="car" size={50} color={colors.white} />
            </View>
         <View style={styles.menuContainer}>
            <CustomButton title="Start Parking" onPressFunction={startParking} color={colors.orange}/> 
            <View style={styles.menuContainer}>
                <Text style={styles.menuSubtitle}>Bookings</Text>
                    <BookingsCard/>
            </View>
            <View style={styles.menuContainer}>
                <Text style={styles.menuSubtitle}>Utilities</Text>
                    <HomeButtons title={'Search for parking lots'} icon={'map-marker-outline'} onPressFunction={() => handleNavigation('SearchParking')}/>
                    <HomeButtons title={'Book Parking spot'} icon={'bookmark-outline'} onPressFunction={''}/>
                    <HomeButtons title={'Checkout'} icon={'wallet-outline'} onPressFunction={''}/>
                    <HomeButtons title={'Help'} icon={'help-circle-outline'} onPressFunction={''}/>
                    
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
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 30,
    },

    scrollView: {
        width:"100%",
       
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
    titleContainer : {
        width: "100%" ,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 45,
        

    },
    menuContainer: {
        marginTop: 35,
        flex: 1
    },
   
    
})