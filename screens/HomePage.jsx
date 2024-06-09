import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import colors from '../assets/colors/colors';
import { Header } from "../components/Header";
import { FontAwesome5 } from '@expo/vector-icons';

const HomePage = ({ navigation }) => {
return(
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <Header/>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Hello Jack</Text>
                <FontAwesome5 name="car" size={50} color={colors.white} />
            </View>
         
        
        </ScrollView>
    </SafeAreaView>
   
);
}

export default HomePage;

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.background,
        paddingHorizontal: 30,
        flex: 1,
        paddingTop: 30,
    },

    scrollView: {
        width:"100%"
    },

    logo: {
        width: 116,
        height: 51,
      
      
    },
    header : {
        width: "100%" ,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },

    title: {
        fontSize: 30,
        fontFamily: 'League Spartan',
        fontWeight: '600',
        color: colors.white,
        alignSelf: 'flex-start',
        
    },
    titleContainer : {
        width: "100%" ,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 45,
        borderColor: colors.orange,
        borderWidth: 1

    },
    
})