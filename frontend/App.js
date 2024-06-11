import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login'
import Register from './screens/Register'
import BookParkingSpot from './screens/BookParkingSpot'
import NFCTicket from './screens/NFCTicket'
import Home from './screens/Home'
import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { useFonts } from 'expo-font';
import SearchParking from './screens/SearchParking';
import Help from './screens/Help';
import Checkout from './screens/Checkout';
import UserSpace from './screens/UserSpace';
import { AuthProvider } from './AuthProvider';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator initialRouteName="Home">
      <InsideStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <InsideStack.Screen name="BookParkingSpot" component={BookParkingSpot} options={{ headerShown: false }} />
      <InsideStack.Screen name="SearchParking" component={SearchParking} options={{ headerShown: false }} />
      <InsideStack.Screen name="NFCTicket" component={NFCTicket} options={{ headerShown: false }} />
      <InsideStack.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <InsideStack.Screen name="Checkout" component={Checkout} options={{ headerShown: false }} />
      <InsideStack.Screen name="UserSpace" component={UserSpace} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  )

}

export default function App() {
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    'League Spartan': require('./assets/fonts/League_Spartan/LeagueSpartan-VariableFont_wght.ttf'),
    'League Spartan-SemiBold': require("./assets/fonts/League_Spartan/LeagueSpartan-SemiBold.ttf"),
  });


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, []);


  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
          {user ? (
            <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            </>
          )}
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}