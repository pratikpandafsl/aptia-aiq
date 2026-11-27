import { ArrowLeft } from "lucide-react";
import { ChatButton } from "./chat-button";
import { ChatHeader } from "./chat-header";

export function PromptingGuide({ onBack }: { onBack: () => void }) {
  return <div className="assistant-app prompting-guide-page">
    <ChatHeader guideActive onPromptingGuide={() => {}}/>
    <main className="prompting-guide-content">
      <ChatButton className="guide-back" onClick={onBack}><ArrowLeft size={13}/>Back to assistant</ChatButton>
      <h1>Prompting guide</h1>
      <p className="guide-intro">Start with a clear question, give the relevant context, and say what you need back.</p>
      <section>
        <h2>What to include</h2>
        <ol>
          <li><strong>Scheme name.</strong> State which pension scheme your question relates to.</li>
          <li><strong>Member details, when relevant.</strong> Include the member’s National Insurance number for a member-specific query. General process questions do not need one.</li>
          <li><strong>The question and context.</strong> Mention relevant dates, the benefit or process, and any information that is missing or uncertain.</li>
          <li><strong>The output you need.</strong> Ask for a process explanation, checks to complete, or a draft communication.</li>
        </ol>
      </section>
      <section>
        <h2>Example prompts</h2>
        <blockquote>“For [scheme name], what checks should I complete before applying the annual pension increase?”</blockquote>
        <blockquote>“For [scheme name], member [National Insurance number] has asked about retiring on [date]. What information is needed to prepare an estimate?”</blockquote>
      </section>
      <section>
        <h2>Keep the context focused</h2>
        <p>Provide only the information needed for the question. Avoid unrelated personal details, passwords or access credentials. If the scheme or record is uncertain, state that clearly rather than guessing.</p>
      </section>
    </main>
  </div>;
}