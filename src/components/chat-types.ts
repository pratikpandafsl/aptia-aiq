export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface ChatSource {
  id: string;
  title: string;
  kind: "record" | "document";
  status: string;
  fields: { label: string; value: string }[];
  excerpt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  sources: ChatSource[];
  reasoning: string[];
  validation: { label: string; detail: string }[];
  confidence: number | null;
  answerDetails?: {
    timeline: { label: string; text: string; detail?: string }[];
    checks: { label: string; detail: string; warning?: boolean }[];
    pending: string[];
  };
}