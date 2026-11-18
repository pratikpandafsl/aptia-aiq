import { describe, expect, it } from "vitest";
import { formatChatExport, getChatExportFilename } from "../lib/chat-export";
import type { Conversation } from "../components/chat-types";
import { conversations } from "../data.js";

const chat: Conversation = {
  id: "sample", title: "JLR spouse pension rule", confidence: null, reasoning: ["Internal reasoning"], validation: [],
  messages: [{ id: "1", role: "user", userRole: "Administrator", text: "First question" }, { id: "2", role: "assistant", text: "First answer" }, { id: "3", role: "user", userRole: "Reviewer", text: "Follow-up" }, { id: "4", role: "assistant", text: "Second answer\n\nKey points:\nKeep paragraphs" }],
  sources: [{ id: "jlr.1", title: "JLR_Pension_Scheme_Rules.pdf", kind: "document", status: "Current", fields: [{ label: "Version", value: "2022 consolidation" }, { label: "Reference", value: "Rule 14 Pension sharing on divorce" }], excerpt: "Not included in export" }],
};
describe("Chat text export", () => {
  it("names downloads using the bot name and full history title", () => {
    expect(getChatExportFilename("Weir normal pension age")).toBe("aptia-iq-weir-normal-pension-age.txt");
  });
  it("uses a changed bot name for filenames and transcript branding", () => {
    expect(getChatExportFilename("Weir normal pension age", "Member Assist")).toBe("member-assist-weir-normal-pension-age.txt");
    const output = formatChatExport(chat, "2026-11-18T11:41:47Z", "Member Assist");
    expect(output.startsWith("Member Assist – JLR spouse pension rule\n")).toBe(true);
    expect(output).toContain("MA (for human review):");
    expect(output).not.toContain("Aptia's IQ");
  });
  it("uses the supplied server timestamp in the reference time zone", () => {
    expect(formatChatExport(chat, "2026-11-18T11:41:47Z").split("\n").slice(0, 2)).toEqual(["Aptia's IQ – JLR spouse pension rule", "Exported 18/11/2026, 17:11:47"]);
  });
  it("preserves every turn, user role, paragraphs and source file reference in order", () => {
    expect(formatChatExport(chat, "2026-11-18T11:41:47Z")).toBe("Aptia's IQ – JLR spouse pension rule\nExported 18/11/2026, 17:11:47\n\nADMINISTRATOR:\nFirst question\n\nAIQ (for human review):\nFirst answer\n\nREVIEWER:\nFollow-up\n\nAIQ (for human review):\nSecond answer\n\nKey points:\nKeep paragraphs\n\nSources:\n  [jlr.1] JLR_Pension_Scheme_Rules.pdf · 2022 consolidation · Rule 14 Pension sharing on divorce\n");
  });
  it("rejects a missing or invalid server timestamp", () => {
    expect(() => formatChatExport(chat, "")).toThrow("Invalid server timestamp");
  });
  it("exports all five Weir normal pension age exchanges in order", () => {
    const conversation = conversations.find((record) => record.id === "weir-npa");
    if (!conversation) throw new Error("Missing Weir conversation");
    expect(conversation.messages).toHaveLength(10);
    const output = formatChatExport(conversation, "2026-11-18T11:45:00Z");
    expect(output.match(/ADMINISTRATOR:/g)).toHaveLength(5);
    expect(output.match(/AIQ \(for human review\):/g)).toHaveLength(5);
    let position = -1;
    for (const message of conversation.messages) {
      const next = output.indexOf(message.text, position + 1);
      expect(next).toBeGreaterThan(position);
      position = next;
    }
    expect(output.indexOf("Sources:")).toBeGreaterThan(position);
  });
});