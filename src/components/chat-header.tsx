import type { ReactNode } from "react";
import { BOT_NAME, getBotInitials } from "../lib/chat-config";
import { ChatButton } from "./chat-button";

export function ChatHeader({ onPromptingGuide, guideActive = false, children }: { onPromptingGuide: () => void; guideActive?: boolean; children?: ReactNode }) {
  return <header className="assistant-header">
    <div className="brand-lockup"><div className="brand-avatar">{getBotInitials()}</div><div><strong>{BOT_NAME}</strong><small>APTIA COLLEAGUE ASSIST</small></div></div>
    <nav aria-label="Main navigation">
      <ChatButton className={guideActive ? "guide-nav selected" : "guide-nav"} onClick={onPromptingGuide} aria-current={guideActive ? "page" : undefined}>Prompting guide</ChatButton>
      {[`What can I ask ${getBotInitials()}?`, "FAQs", "Contact us"].map((label) => <a key={label} href="#">{label}</a>)}
    </nav>
    {children}
  </header>;
}