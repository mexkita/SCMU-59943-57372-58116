import { SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../assets/colors/colors";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import  Header  from "../components/Header";
import {Marker} from 'react-native-maps';
import { useState } from "react";
import { SearchBar } from '@rneui/themed';
import { BottomSheet } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomButton from "../components/CustomButton";


const SearchParking = () => {

    // Maybe mudar para FCT
    const INITIAL_REGION = {
        latitude: 38.72249845287284,
        longitude: -9.137780372648901 ,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    }

   // const [markers, setMarkers] = useState();

    

    const [search, setSearch] = useState("");
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);


    const updateSearch = (search) => {
        setSearch(search);
    };
  



    const markers = [
        {
            latitude: 38.72249845287284,
            longitude: -9.137780372648901 ,
            latitudeDelta: 2,
            longitudeDelta: 2,
            title: 'Parking Lot x',
            totalSlots: 200,
            availableSlots: 100,
            pricePerHour: '0.5€'

        },
        {
            latitude: 38.66192985095062, 
            longitude: -9.205607571001307 ,
            latitudeDelta: 2,
            longitudeDelta: 2,
            title: 'Parking Lot FCT',
            totalSlots: 200,
            availableSlots: 150,
            pricePerHour: '0.7€'

        }
    ]

    const filteredMarkers = markers.filter(marker => 
        marker.title.toLowerCase().includes(search.toLowerCase())
    );

    const onMarkerPress = (marker) => {
        setSelectedMarker(marker);
        setBottomSheetVisible(true);
    };
       const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
            <Header/>
        </View>
        
          <View style={styles.mapContainer}>
             <View style={styles.searchBar}>
                <SearchBar
                   placeholder="Type Here..."
                   onChangeText={updateSearch}
                   value={search}
                   platform="default"
                   containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }}
                   inputContainerStyle={{ backgroundColor: colors.background,}}
                   inputStyle={{caretColor: colors.orange, color: colors.white}}
                   round
                   showCancel
                />
            </View>
              <MapView 
              style={StyleSheet.absoluteFill} 
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              showsMyLocationButton
              initialRegion={INITIAL_REGION}
             
              >
                {filteredMarkers.map((marker, index) => (
                    <Marker
                    key={index}
                    coordinate={marker}
                    pinColor='#006'
                    onPress={() => onMarkerPress(marker)}
                    />
                    
                ))}
              </MapView>
              <BottomSheet
               isVisible={isBottomSheetVisible}
               onBackdropPress={closeBottomSheet}
               backdropStyle={null} 
               >
                <TouchableWithoutFeedback>
                    <View style={styles.bottomSheetContainer}>
                        {selectedMarker && (
                            <>
                              <View style={styles.bottomSheetLayout}>
                                <Text style={styles.bottomSheetTitle}>{selectedMarker.title}</Text>
                                <View style={styles.bottomSheetRow}>
                                    <View style={styles.bottomSheetRowParts}>
                                    <FontAwesome5 name="car" size={30} color={colors.white} />
                                    <Text style={styles.bottomSheetDescription}>{selectedMarker.availableSlots}/{selectedMarker.totalSlots}</Text>
                                    </View>
                                    <View style={styles.bottomSheetRowParts}>
                                    <FontAwesome5 name="euro-sign" size={24} color={colors.white} />
                                    <Text style={styles.bottomSheetDescription}>{selectedMarker.pricePerHour}/1h</Text>
                                    </View>
                                </View>

                                </View>
                            </>
                        )}
                        <CustomButton title={'Book'} onPressFunction={() => setBottomSheetVisible(false)} color={colors.orange}/>
                       
                    </View>
                    </TouchableWithoutFeedback>
                </BottomSheet>


          </View>
      </SafeAreaView>
         
      </TouchableWithoutFeedback>
       
      )



}

export default SearchParking;


const styles = StyleSheet.create({
 container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingTop: 30,
       
    },

    headerContainer:{
        paddingHorizontal: 30,
       
    },
    mapContainer: {
        
       marginTop: 15,
       flex:1
     
    },
    calloutContainer:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },

    calloutText:{
        paddingTop: 5,
        fontSize: 15,
        fontFamily: 'League Spartan',
        fontWeight: '500',
        color: colors.greyText,
        alignSelf: 'center',
    },
    calloutTitle:{
        
        fontSize: 18,
        fontFamily: 'League Spartan',
        fontWeight: '500',
        color: colors.black,
        alignSelf: 'center',
    },
    searchBar:{
        position: 'absolute',
        top: 20,
        width: '90%',
        alignSelf: 'center',
        zIndex: 1,
        borderRadius: 5,
    },

    bottomSheetLayout:{
        borderColor: colors.orange,
         borderWidth: 1,
          padding: 15, 
          borderRadius: 5,
           marginBottom: 50, 
           marginTop: 20
    },



    bottomSheetContainer: {
        padding: 20,
        height:270,
        backgroundColor: colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    bottomSheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:colors.white
    },
    bottomSheetDescription: {
        fontSize: 16,
        color:colors.white,
        alignItems: 'center',
        paddingLeft: 10,
    

    },

    bottomSheetRow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
       
    },
    bottomSheetRowParts:{
        flexDirection: 'row',
        alignItems: 'center',
       
    }
    


})