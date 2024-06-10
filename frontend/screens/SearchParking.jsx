import { SafeAreaView, ScrollView, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../assets/colors/colors";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { Header } from "../components/Header";

const SearchParking = () => {

    const INITIAL_REGION = {
       
    }

    return (
        <SafeAreaView style={styles.container}>
          
            <Header/>
            <View style={styles.mapContainer}>
                <MapView style={StyleSheet.absoluteFill} />
            </View>
           
        
        </SafeAreaView>
      )



}

export default SearchParking;


const styles = StyleSheet.create({
 container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingTop: 30,
       
    },
    mapContainer: {
        
        flex:1
     
    },

})