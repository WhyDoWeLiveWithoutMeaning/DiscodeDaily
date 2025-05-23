import { DiscordSDK } from "@discord/embedded-app-sdk";

let discordSdk = null;

try {
    discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
    await discordSdk.ready();
} catch (error) {
    console.error("Failed to initialize Discord SDK:", error);
    discordSdk = null;
}

export default discordSdk;
