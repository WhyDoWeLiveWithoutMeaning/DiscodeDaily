export function openDiscordAuthPopup() {
    return new Promise((resolve, reject) => {
        const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI);
        const scope = "identify";
        const responseType = "code";
        
        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

        const width = 500;
        const height = 700;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            url,
            'DiscordAuth',
            `width=${width},height=${height},top=${top},left=${left},resizable=no`
        );

        if (!popup) {
            reject(new Error("Failed to open popup. It may have been blocked by the browser."));
            return;
        }

        popup.focus();

        // Set up a message listener instead of polling
        const messageHandler = (event) => {
            // Make sure the message is from our redirect page
            const redirectOrigin = new URL(import.meta.env.VITE_DISCORD_REDIRECT_URI).origin;
            
            if (event.origin === redirectOrigin && event.data.type === 'DISCORD_AUTH_CODE') {
                // Got the code from our redirect page
                window.removeEventListener('message', messageHandler);
                popup.close();
                resolve(event.data.code);
            }
        };

        window.addEventListener('message', messageHandler);

        // Still use a polling mechanism as a fallback, but only to detect closure
        const pollTimer = setInterval(() => {
            if (popup.closed) {
                clearInterval(pollTimer);
                window.removeEventListener('message', messageHandler);
                reject(new Error("Authentication window was closed"));
            }
        }, 500);

        // Set a timeout to prevent hanging
        setTimeout(() => {
            clearInterval(pollTimer);
            window.removeEventListener('message', messageHandler);
            if (!popup.closed) {
                popup.close();
            }
            reject(new Error("Authentication timed out"));
        }, 120000); // 2 minutes timeout
    });
}