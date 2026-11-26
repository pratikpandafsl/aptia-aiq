import { useEffect, useRef, useState } from "react";

export interface ChatSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => ChatSpeechRecognition;
  webkitSpeechRecognition?: new () => ChatSpeechRecognition;
};

/** Browser-managed dictation; never submits a message or stores audio. */
export function useChatSpeech(value: string, onChange: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const current = useRef<ChatSpeechRecognition | null>(null);

  const stop = () => {
    const recognition = current.current;
    current.current = null;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    }
    setListening(false);
  };

  useEffect(() => () => {
    const recognition = current.current;
    if (recognition) {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      current.current = null;
    }
  }, []);

  const toggle = () => {
    if (current.current) { stop(); return; }
    setError("");
    const browser = window as SpeechWindow;
    const Recognition = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice input is unavailable in this browser. Try Chrome or Edge, or type your question.");
      return;
    }
    const recognition = new Recognition();
    const prefix = value.trimEnd();
    recognition.lang = "en-GB";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      if (current.current !== recognition) return;
      const transcript = Array.from(event.results, (result) => result[0]?.transcript ?? "").join(" ").trim();
      onChange([prefix, transcript].filter(Boolean).join(" "));
    };
    recognition.onerror = ({ error: code }) => {
      const messages: Record<string, string> = {
        "not-allowed": "Microphone permission was denied. Allow microphone access in your browser and try again.",
        "service-not-allowed": "Speech recognition is blocked by your browser. Try another browser or type your question.",
        "audio-capture": "No microphone is available. Connect a microphone and try again.",
        "no-speech": "No speech was detected. Please try again.",
        network: "Speech recognition could not connect. Check your connection and try again.",
      };
      if (code !== "aborted") setError(messages[code] ?? "Voice input stopped. Please try again or type your question.");
      stop();
    };
    recognition.onend = () => {
      if (current.current === recognition) { current.current = null; setListening(false); }
    };
    current.current = recognition;
    try { recognition.start(); setListening(true); }
    catch { stop(); setError("Could not start voice input. Please try again or type your question."); }
  };

  return { listening, error, toggle, stop, clearError: () => setError("") };
}