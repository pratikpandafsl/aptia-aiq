import type { Conversation } from "../components/chat-types";
import { BOT_NAME, getBotInitials } from "./chat-config";

export function getChatExportFilename(title: string, botName = BOT_NAME): string {
  const slug = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[’']s\b/gi, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug(botName) || "bot"}-${slug(title) || "chat"}.txt`;
}

export function formatChatExport(conversation: Conversation, serverTime: string, botName = BOT_NAME): string {
  const date = new Date(serverTime);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid server timestamp");
  const exported = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(date);
  const messages = conversation.messages.map((message) =>
    `${message.role === "assistant" ? `${getBotInitials(botName)} (for human review)` : (message.userRole ?? "Administrator").toUpperCase()}:\n${message.text}`,
  );
  const sources = conversation.sources.map((source) => {
    const version = source.fields.find((field) => field.label === "Version")?.value;
    const reference = source.fields.find((field) => field.label === "Reference")?.value;
    return `  [${source.id}] ${[source.title, version, reference].filter(Boolean).join(" · ")}`;
  });
  return [`${botName} – ${conversation.title}\nExported ${exported}`, ...messages, `Sources:\n${sources.join("\n")}`].join("\n\n") + "\n";
}

// The origin's HTTP Date header supplies server time even on a static host.
// Never silently substitute the visitor's clock if this is unavailable.
export async function getExportServerTime(): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}?export-time=${crypto.randomUUID()}`, { method: "HEAD", cache: "no-store" });
  const serverTime = response.headers.get("Date");
  if (!response.ok || !serverTime || Number.isNaN(Date.parse(serverTime))) throw new Error("Server time unavailable");
  return serverTime;
}

export function downloadChatText(text: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}