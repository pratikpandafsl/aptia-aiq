/** Temporary local summary; also used if future AI title generation fails. */
export function summarizeFirstMessage(firstMessage: string): string {
  const ignored = new Set(["a", "an", "the", "i", "my", "me", "you", "your", "we", "our", "can", "could", "would", "should", "please", "help", "check", "tell", "explain", "what", "which", "where", "when", "how", "is", "are", "do", "does", "to", "for", "of", "in", "on", "at", "and", "about", "need", "want", "know"]);
  const words = firstMessage.trim().match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)?/gu) ?? [];
  const meaningful = words.filter((word) => !ignored.has(word.toLowerCase()));
  const title = (meaningful.length ? meaningful : words).slice(0, 6).join(" ");
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "New conversation";
}

/**
 * Called once for a new chat, with its first user message only.
 * Replace the local summary below with your awaited AI/API call returning a title.
 * Keep private AI credentials on your server, not in this browser module.
 */
export async function generateHistoryTitle(firstMessage: string): Promise<string> {
  return summarizeFirstMessage(firstMessage);
}