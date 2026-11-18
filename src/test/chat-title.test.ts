import { describe, expect, it } from "vitest";
import { generateHistoryTitle, summarizeFirstMessage } from "../lib/chat-title";

describe("History title generation", () => {
  it("summarizes the first message rather than copying the entire query", async () => {
    expect(await generateHistoryTitle("Can you please explain the Weir normal pension age?")).toBe("Weir normal pension age");
  });
  it("provides a fallback for an empty first message", () => {
    expect(summarizeFirstMessage("  ")).toBe("New conversation");
  });
});