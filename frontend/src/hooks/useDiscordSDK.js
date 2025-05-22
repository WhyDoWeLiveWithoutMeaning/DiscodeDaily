import { useEffect, useState } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import { isRunningInDiscord } from '../utils/isDiscordEmbed'

export function useDiscordSDK() {
  const [discordUser, setDiscordUser] = useState(null);

  useEffect(() => {
    if (!isRunningInDiscord()) {
      console.log("Not running inside Discord — skipping SDK init.");
      return;
    }

    // Only try to initialize the SDK if we're in Discord
    if (window.DiscordNative) {
      const init = async () => {
        try {
          const discordSdk = new DiscordSDK(window.DiscordNative);
          await discordSdk.ready();

          console.log("Discord SDK ready!");

          const { code } = await discordSdk.commands.authorize({
            client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
            scopes: ['identify'],
          });

          // Exchange the code using your backend (or direct fetch during dev)
          const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
              client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
              grant_type: 'authorization_code',
              code,
              redirect_uri: import.meta.env.VITE_REDIRECT_URI,
            }),
          });

          const { access_token } = await tokenRes.json();

          const userInfo = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${access_token}` }
          }).then(res => res.json());

          setDiscordUser(userInfo);
          console.log("Discord user:", userInfo);
        } catch (error) {
          console.error("Discord SDK init failed:", error);
        }
      };

      init();
    }
  }, []);

  return discordUser;
}