import React, { createContext, useContext, useState, useEffect } from 'react';
import discordSdk from '../utils/setupDiscordSdk';
import { getAuthCode, getAccessToken, getAuthenticatedUser } from '../utils/getAuthCode';

// Create the context
export const UserContext = createContext(null);

// Provider component
export const UserProvider = ({ children }) => {
    const [inDiscord, setInDiscord] = useState(!!discordSdk);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("UserProvider mounted");

        if (!discordSdk) {
            console.log("Discord SDK not available");
            setLoading(false);
            return;
        }

        if (user) {
            console.log("User already authenticated:", auth);
            return;
        }
        console.log("Fetching user info...");

        const fetchUser = async () => {
            try {
                await discordSdk.ready();
                const authCode = await getAuthCode();
                const accessToken = await getAccessToken(authCode);

                localStorage.setItem('discode_access_token', accessToken);

                const authUser = await getAuthenticatedUser(accessToken);
                setUser(authUser.user)
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={{ user, loading, inDiscord, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easy access
export const getUser = () => useContext(UserContext);