import { Bot, CircleCheck, TriangleAlert } from "lucide-react";
import type { Conversation } from "./chat-types";
import { ChatButton } from "./chat-button";

export function ReasoningView({ conversation }: { conversation: Conversation }) {
  const steps = conversation.answerDetails?.timeline ?? conversation.reasoning.map((text, index) => ({ label: ["Understand", "Retrieve", "Reason", "Compose"][index] ?? "Review", text, detail: "" }));
  return <ol className="reasoning-timeline">{steps.map((step) => <li key={step.label}><div className="timeline-label">{step.label}</div><p>{step.text}</p>{step.detail && <small>{step.detail}</small>}</li>)}</ol>;
}

export function ValidationView({ conversation }: { conversation: Conversation }) {
  const checks = conversation.answerDetails?.checks ?? conversation.validation.map((check) => ({ ...check, warning: true }));
  return <div className="validation-view">
    <div className="validation-checks">{checks.map((check) => <div className={`validation-check ${check.warning ? "is-warning" : ""}`} key={check.label}>
      {check.warning ? <TriangleAlert size={14}/> : <CircleCheck size={14}/>}
      <div><h3>{check.label}</h3><p>{check.detail}</p></div>
    </div>)}</div>
    {conversation.answerDetails?.pending.length ? <section className="validation-pending"><h3>Still to verify</h3><ul>{conversation.answerDetails.pending.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
    <section className="second-opinion"><h3><Bot size={14}/>Second-opinion validator</h3><p>An independent AI agent re-reads the sources, challenges the answer and suggests what else to check.</p><ChatButton className="validate-deeper" disabled title="API connection required">Validate deeper</ChatButton></section>
  </div>;
}