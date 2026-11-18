// Change this value to rename the bot throughout the chat and its exports.
export const BOT_NAME = "Aptia's IQ";

export function getBotInitials(name = BOT_NAME): string {
  return name.replace(/[’']s\b/gi, "").split(/\s+/).map((word) => word.match(/[a-z0-9]/gi)?.join("").toUpperCase()).filter(Boolean).map((word) => word && word.length <= 2 ? word : word?.[0]).join("");
}