import { fireEvent, render, screen, within, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import PensionAssistant from "../components/pension-assistant";

afterEach(cleanup);

describe("Sample conversation history", () => {
  it("opens history and restores messages, sources, reasoning and validation for the selected record", () => {
    render(<PensionAssistant />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(screen.getByRole("button", { name: "B Khan LRF calculation" }));
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("QQ000013A");
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("Rounded LRF: 1.587");
    expect(screen.getByRole("tabpanel").textContent).toContain("Weir_Group_Trust_Deed_and_Rules.pdf");
    fireEvent.click(screen.getByRole("tab", { name: "How it answered" }));
    expect(screen.getByRole("tabpanel").textContent).toContain("months = 72");
    fireEvent.click(screen.getByRole("tab", { name: "Validation" }));
    expect(screen.getByRole("tabpanel").textContent).toContain("GMP uplift must be calculated separately");
    fireEvent.click(screen.getByRole("button", { name: "Bereavement documents" }));
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("death certificate");
    expect(screen.getByLabelText("Conversation messages").textContent).not.toContain("QQ000013A");
    expect(screen.getByRole("tabpanel").textContent).toContain("Bereavement_Checklist.pdf");
  });

  it("starts an empty new chat while retaining existing conversations", () => {
    render(<PensionAssistant />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.click(screen.getByRole("button", { name: "B Khan LRF calculation" }));
    fireEvent.change(screen.getByLabelText("Ask a question"), { target: { value: "Unsent question" } });
    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    expect(screen.queryByLabelText("Conversation messages")).toBeNull();
    expect(screen.getByLabelText("Ask a question")).toHaveValue("");
    expect(screen.getByRole("tab", { name: "Sources" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("button", { name: "B Khan LRF calculation" }));
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("Rounded LRF: 1.587");
  });

  it("filters history and closes the sidebar without clearing the selected conversation", () => {
    render(<PensionAssistant />);
    fireEvent.click(screen.getByRole("button", { name: "History" }));
    fireEvent.change(screen.getByLabelText("Search conversations"), { target: { value: "B Khan" } });
    expect(within(screen.getByLabelText("Conversation history")).queryByRole("button", { name: "Bereavement documents" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "B Khan LRF calculation" }));
    fireEvent.click(screen.getByRole("button", { name: "Close history" }));
    expect(screen.queryByLabelText("Conversation history")).toBeNull();
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("QQ000013A");
  });
});