import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    
    const [userToken, setUserToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isGuest, setIsGuest] = useState(false)

    const login = async (token) => {    
        try {
            await AsyncStorage.setItem('userToken', token)
            await AsyncStorage.removeItem('isGuest')
            setUserToken(token);
            setIsGuest(false);
        } catch (error) {
            console.error('Failed to save token: ', error)
        }
    };

    const logout = async () => {
   
        try {        
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem("isGuest")
            setUserToken(null);
            setIsGuest(false)

        } catch (error) {
            console.error("Failed to remove token: " + error)
        }
    };

    const continueAsGuest = async (navigation) => {
        await AsyncStorage.setItem("isGuest", "true");
        setIsGuest(true);
        setUserToken(null);

        navigation.reset({
            index: 0,
            routes: [{ name: "Home" }], // Redirect guest to Home
        });

    }

    useEffect(() => {

        const loadAuthState = async () => {
            const token = await AsyncStorage.getItem('userToken')
            const guestMode = await AsyncStorage.getItem('isGuest')
    
            if (guestMode === "true") {
                setIsGuest(true)
            } else if (token) {
                setUserToken(token)
            }
    
            setLoading(false);
    
        }
     
        loadAuthState()

    }, [])
    

    return (
        <AuthContext.Provider value={{userToken, login, logout, loading, isGuest, continueAsGuest}}>
            {children}
        </AuthContext.Provider>
    )

}


