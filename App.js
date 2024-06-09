import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login'
import Register from './screens/Register'
import Home from './screens/Home'
import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import { useFonts } from 'expo-font';
import SearchParking from './screens/SearchParking';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </InsideStack.Navigator>
  )

}

export default function App() {
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    'League Spartan': require('./assets/fonts/League_Spartan/LeagueSpartan-VariableFont_wght.ttf'),
    'League Spartan': require("./assets/fonts/League_Spartan/LeagueSpartan-SemiBold.ttf"),
  });

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="SearchParking" component={SearchParking} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}