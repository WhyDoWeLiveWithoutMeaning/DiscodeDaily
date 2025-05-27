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
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/discord`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: authCode,
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

export const getUserInfo = async (access_token) => {
  try {
    const response = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};
