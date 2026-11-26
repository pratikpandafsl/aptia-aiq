import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PensionAssistant from "../components/pension-assistant";
import type { ChatSpeechRecognition } from "../hooks/use-chat-speech";

let recognition: FakeRecognition | undefined;
class FakeRecognition implements ChatSpeechRecognition {
  lang = "";
  continuous = false;
  interimResults = false;
  onresult: ChatSpeechRecognition["onresult"] = null;
  onerror: ChatSpeechRecognition["onerror"] = null;
  onend: ChatSpeechRecognition["onend"] = null;
  start = vi.fn();
  abort = vi.fn();
  constructor() { recognition = this; }
}
function instance() {
  if (!recognition) throw new Error("Recognition was not started");
  return recognition;
}
beforeEach(() => {
  recognition = undefined;
  vi.stubGlobal("SpeechRecognition", FakeRecognition);
  vi.stubGlobal("webkitSpeechRecognition", undefined);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("Chat dictation", () => {
  it("appends and replaces speech results without sending until Send is clicked", async () => {
    render(<PensionAssistant/>);
    fireEvent.change(screen.getByLabelText("Ask a question"), { target: { value: "Weir" } });
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    expect(instance().start).toHaveBeenCalledOnce();
    act(() => instance().onresult?.({ results: [[{ transcript: "normal pension" }]] }));
    expect(screen.getByLabelText("Ask a question")).toHaveValue("Weir normal pension");
    act(() => instance().onresult?.({ results: [[{ transcript: "normal pension age" }]] }));
    expect(screen.getByLabelText("Ask a question")).toHaveValue("Weir normal pension age");
    expect(screen.queryByLabelText("Conversation messages")).not.toBeInTheDocument();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Send" })); });
    expect(screen.getByLabelText("Conversation messages").textContent).toContain("Weir normal pension age");
    expect(instance().abort).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Ask a question")).toHaveValue("");
  });

  it("stops dictation while preserving the current draft", () => {
    render(<PensionAssistant/>);
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    act(() => instance().onresult?.({ results: [[{ transcript: "Check my pension" }]] }));
    fireEvent.click(screen.getByRole("button", { name: "Stop voice input" }));
    expect(instance().abort).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Ask a question")).toHaveValue("Check my pension");
  });

  it("rejects late speech results after starting a new chat", () => {
    render(<PensionAssistant/>);
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    const delayed = instance().onresult;
    fireEvent.click(screen.getByRole("button", { name: "New chat" }));
    act(() => delayed?.({ results: [[{ transcript: "old question" }]] }));
    expect(screen.getByLabelText("Ask a question")).toHaveValue("");
    expect(instance().abort).toHaveBeenCalledOnce();
  });

  it("shows permission denial and leaves typed input usable", () => {
    render(<PensionAssistant/>);
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    act(() => instance().onerror?.({ error: "not-allowed" }));
    expect(screen.getByRole("alert").textContent).toContain("Microphone permission was denied");
    fireEvent.change(screen.getByLabelText("Ask a question"), { target: { value: "Typed question" } });
    expect(screen.getByLabelText("Ask a question")).toHaveValue("Typed question");
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("marks the mic as recording without adding a status line under the box", () => {
    render(<PensionAssistant/>);
    const composer = document.querySelector(".composer-area") as HTMLElement;
    const heightBefore = composer.getBoundingClientRect().height;
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    const mic = screen.getByRole("button", { name: "Stop voice input" });
    expect(mic).toHaveAttribute("aria-pressed", "true");
    expect(mic.className).toContain("listening");
    expect(screen.queryByText("Listening…", { selector: "p" })).not.toBeInTheDocument();
    expect(composer.getBoundingClientRect().height).toBe(heightBefore);
  });

  it("reports unavailable speech recognition without affecting typing", () => {
    vi.stubGlobal("SpeechRecognition", undefined);
    render(<PensionAssistant/>);
    fireEvent.click(screen.getByRole("button", { name: "Start voice input" }));
    expect(screen.getByRole("alert").textContent).toContain("Voice input is unavailable");
    expect(screen.getByLabelText("Ask a question")).toBeEnabled();
  });
});