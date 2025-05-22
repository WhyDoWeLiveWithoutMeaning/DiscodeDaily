// utils/isDiscordEmbed.js
export const isRunningInDiscord = () =>
  typeof window !== 'undefined' &&
  window.DiscordNative !== undefined &&
  window.location !== window.parent.location;
