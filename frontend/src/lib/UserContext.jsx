import React, { createContext, useContext, useState, useEffect } from 'react';
import discordSdk from '../utils/setupDiscordSdk';
import { getAuthCode, getAccessToken, getAuthenticatedUser } from '../utils/getAuthCode';

// Create the context
export const UserContext = createContext(null);

// Provider component
export const UserProvider = ({ children }) => {
    const [auth, setAuth] = useState(null); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("UserProvider mounted");

        if (auth) {
            console.log("User already authenticated:", auth);
            return;
        }
        console.log("Fetching user info...");
        // Function to fetch user info

        const fetchUser = async () => {
            try {
                await discordSdk.ready();
                console.log("Discord SDK is ready");

                const authCode = await getAuthCode();
                console.log("Auth Code:", authCode);
                const accessToken = await getAccessToken(authCode);
                console.log("Access Token:", accessToken);
                const authUser = await getAuthenticatedUser(accessToken);
                console.log("User Info:", authUser);
                setAuth(authUser);
                setUser(authUser.user)

                console.log("User set in context:", authUser.user);
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easy access
export const useUser = () => useContext(UserContext);