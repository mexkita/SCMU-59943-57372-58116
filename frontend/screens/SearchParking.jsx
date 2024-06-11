import { SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../assets/colors/colors";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Header from "../components/Header";
import { Marker } from 'react-native-maps';
import { useEffect, useState } from "react";
import { SearchBar } from '@rneui/themed';
import { BottomSheet } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { parkApi } from "../api";


const SearchParking = () => {

    const navigation = useNavigation();

    // Maybe mudar para FCT
    const INITIAL_REGION = {
        latitude: 38.72249845287284,
        longitude: -9.137780372648901,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
    }

    const [markers, setMarkers] = useState([]);
    const [search, setSearch] = useState("");
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        getAllParkings();
    }, []);

    const getAllParkings = async () => {

        try {
            const parkingLots = await parkApi.getAllParks()
            setMarkers(parkingLots)
        } catch (err) {
            console.log(err)
        }

    }

    const updateSearch = (search) => {
        setSearch(search);
    };

    const handleBooking = (parkingLot) => {
        setBottomSheetVisible(false);
        navigation.navigate('BookParkingSpot', { park: parkingLot });
    }

    const filteredMarkers = markers.filter(marker =>
        marker.title.toLowerCase().includes(search.toLowerCase())
    );

    const onMarkerPress = (marker) => {
        setSelectedMarker(marker);
        console.log(marker)
        setBottomSheetVisible(true);
    };
    const closeBottomSheet = () => {
        setBottomSheetVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Header />
                </View>

                <View style={styles.mapContainer}>
                    <View style={styles.searchBar}>
                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={updateSearch}
                            value={search}
                            platform="default"
                            containerStyle={{ backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 }}
                            inputContainerStyle={{ backgroundColor: colors.background, }}
                            inputStyle={{ caretColor: colors.orange, color: colors.white }}
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
                        {filteredMarkers.map((marker) => (
                            <Marker
                                key={marker.id}
                                coordinate={marker}
                                pinColor={colors.orange}
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
                                                    <FontAwesome5 name="car" size={25} color={colors.white} />
                                                    <Text style={styles.bottomSheetDescription}>{selectedMarker.free_spots}/{selectedMarker.total_spots}</Text>
                                                </View>
                                                <View style={styles.bottomSheetRowParts}>
                                                    <FontAwesome5 name="bookmark" size={20} color={colors.white} />
                                                    <Text style={styles.bottomSheetDescription}>{selectedMarker.free_reserved_spots}</Text>
                                                </View>
                                                <View style={styles.bottomSheetRowParts}>
                                                    <FontAwesome5 name="euro-sign" size={25} color={colors.white} />
                                                    <Text style={styles.bottomSheetDescription}>{selectedMarker.pricePerHour}{selectedMarker.price_per_hour}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </>
                                )}
                                <CustomButton title={'Book'} onPressFunction={() => handleBooking(selectedMarker)} color={colors.orange} />

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

    headerContainer: {
        paddingHorizontal: 30,

    },
    mapContainer: {

        marginTop: 15,
        flex: 1

    },
    searchBar: {
        position: 'absolute',
        top: 20,
        width: '90%',
        alignSelf: 'center',
        zIndex: 1,
        borderRadius: 5,
    },

    bottomSheetLayout: {
        borderColor: colors.orange,
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
        marginBottom: 35,
        marginTop: 20
    },

    bottomSheetContainer: {
        padding: 20,
        height: 270,
        backgroundColor: colors.background,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.white
    },
    bottomSheetDescription: {
        fontSize: 18,
        color: colors.white,
        alignItems: 'center',
        paddingLeft: 10,


    },

    bottomSheetRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    bottomSheetRowParts: {
        flexDirection: 'row',
        alignItems: 'center',

    }



})