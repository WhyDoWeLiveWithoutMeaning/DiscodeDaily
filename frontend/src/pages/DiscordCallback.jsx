import { useEffect } from "react";

const DiscordCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && window.opener) {
      window.opener.postMessage({ type: "DISCORD_AUTH_CODE", code }, "*");
      window.close(); // optional: close the popup
    } else {
      console.error("Missing code or opener window.");
    }
  }, []);

  return <p>Authenticating with Discord...</p>;
};

export default DiscordCallback;2