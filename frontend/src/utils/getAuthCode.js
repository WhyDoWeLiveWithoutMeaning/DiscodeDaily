import discordSdk from "./setupDiscordSdk";

export const getAuthCode = async () => {
  try {
    const authCode = await discordSdk.commands.authorize({
        client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
        response_type: "code",
        state: "poop",
        prompt: "none",
        scope: ["identify"]
    });
    

    return authCode.code;
  } catch (error) {
    console.error("Error getting auth code:", error);
    throw error;
  }
};

export const getAccessToken = async (authCode) => {
  try {
    // WHAT IT SHOULD BE LATER
    //
    // const response = await fetch('/.proxy/api/token', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         code: authCode,
    //     }),
    // })
    // const { access_token } = await response.json();

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
            client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: authCode,
            redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI,
        }),
    })
    const { access_token } = await response.json();
    return access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

export const getAuthenticatedUser = async (access_token) => {
  try {
    const auth = await discordSdk.commands.authenticate({access_token});

    return auth;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};

