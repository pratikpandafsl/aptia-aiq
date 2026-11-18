import { describe, expect, it } from "vitest";
import { formatChatExport } from "../lib/chat-export";
import type { Conversation } from "../components/chat-types";

const chat: Conversation = {
  id: "sample", title: "JLR spouse pension rule", confidence: null, reasoning: ["Internal reasoning"], validation: [],
  messages: [{ id: "1", role: "user", userRole: "Administrator", text: "First question" }, { id: "2", role: "assistant", text: "First answer" }, { id: "3", role: "user", userRole: "Reviewer", text: "Follow-up" }, { id: "4", role: "assistant", text: "Second answer\n\nKey points:\nKeep paragraphs" }],
  sources: [{ id: "jlr.1", title: "JLR_Pension_Scheme_Rules.pdf", kind: "document", status: "Current", fields: [{ label: "Version", value: "2022 consolidation" }, { label: "Reference", value: "Rule 14 Pension sharing on divorce" }], excerpt: "Not included in export" }],
};
describe("Chat text export", () => {
  it("uses the supplied server timestamp in the reference time zone", () => {
    expect(formatChatExport(chat, "2026-11-18T11:41:47Z").split("\n").slice(0, 2)).toEqual(["Aptia's IQ – JLR spouse pension rule", "Exported 18/11/2026, 17:11:47"]);
  });
  it("preserves every turn, user role, paragraphs and source file reference in order", () => {
    expect(formatChatExport(chat, "2026-11-18T11:41:47Z")).toBe("Aptia's IQ – JLR spouse pension rule\nExported 18/11/2026, 17:11:47\n\nADMINISTRATOR:\nFirst question\n\nAIQ (for human review):\nFirst answer\n\nREVIEWER:\nFollow-up\n\nAIQ (for human review):\nSecond answer\n\nKey points:\nKeep paragraphs\n\nSources:\n  [jlr.1] JLR_Pension_Scheme_Rules.pdf · 2022 consolidation · Rule 14 Pension sharing on divorce\n");
  });
  it("rejects a missing or invalid server timestamp", () => {
    expect(() => formatChatExport(chat, "")).toThrow("Invalid server timestamp");
  });
});