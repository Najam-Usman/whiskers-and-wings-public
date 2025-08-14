import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useContext, useEffect, useRef } from 'react';
import Loginscreen from './app/screen/loginscreen/Loginscreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigation from './app/navigation/TabNavigation';
import colours from './src/COLOURS';
import ProfileScreen from './app/screen/profileScreen/ProfileScreen';
import Registerscreen from './app/screen/registerScreen/Registerscreen';
import WishlistScreen from './app/screen/wishlistScreen/WishlistScreen';
import AdoptionFormScreen from './app/screen/adoptionFormScreen/AdoptionFormScreen';
import { AuthContext, AuthProvider } from './app/contexts/AuthContext';
import LoadingIndicator from './app/components/LoadingIndicator';


SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator()


const MainApp = () => {

  const { userToken, loading, isGuest } = useContext(AuthContext);
  const navigationRef = useRef(null);

  const [fontsLoaded] = useFonts({

    'Righteous': require('./assets/fonts/Righteous-Regular.ttf'),
    'Nunito': require('./assets/fonts/Nunito-VariableFont_wght.ttf'),
    'Poppins-Regular' : require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold' : require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold' : require('./assets/fonts/Poppins-Bold.ttf'),
  });


  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  useEffect(() => {
    if (!userToken && navigationRef.current && !isGuest) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [userToken, isGuest])

  if (!fontsLoaded || loading) {
    return <LoadingIndicator message={"Loading..."} />
  }

  return (

    <View style={styles.container} onLayout={onLayoutRootView}>

      <NavigationContainer ref={navigationRef}>

        <Stack.Navigator
          screenOptions={{ headerShown: false, gestureEnabled: false, initialRouteName: "Login" }}
          initialRouteName={userToken || isGuest ? "Home" : "Login"}
        >

          {userToken || isGuest ? (
            <Stack.Screen name='Home' component={TabNavigation} />
          ) : (
            <>
              <Stack.Screen name='Login' component={Loginscreen} />
              <Stack.Screen name='Register' component={Registerscreen} />
            </>
          )}

          <Stack.Screen name='Profile' component={ProfileScreen} />
          <Stack.Screen name='Wishlist' component={WishlistScreen} />
          <Stack.Screen name='AdoptionForm' component={AdoptionFormScreen} />

        </Stack.Navigator>

      </NavigationContainer>

      <StatusBar style="auto" />

    </View>


  );
}


export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary,
  },

});
