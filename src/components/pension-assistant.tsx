import { submitSourceFeedback } from "@/lib/source-feedback";
import { useEffect, useRef, useState } from "react";
import { History, Plus, ArrowUp, BookOpenCheck, X, Search, MessageSquare, Database, FileText, Download, ThumbsUp, ThumbsDown, ShieldCheck, PanelRight, Mic, Square } from "lucide-react";
import { useChatSpeech } from "../hooks/use-chat-speech";
import { conversations as sampleConversations, dummyResponse } from "../data.js";
import type { Conversation } from "./chat-types";
import { ChatButton as Button } from "./chat-button";
import { ReasoningView, ValidationView } from "./answer-detail-views";
import { downloadChatText, formatChatExport, getChatExportFilename, getExportServerTime } from "../lib/chat-export";
import { BOT_NAME, getBotInitials } from "../lib/chat-config";
import { generateHistoryTitle, summarizeFirstMessage } from "../lib/chat-title";
import { ChatAttachments } from "./chat-attachments";
import { ChatMode } from "./chat-mode";

const tabs = ["Sources", "How it answered", "Validation"] as const;
const points = ["Documents and data records cited, with file name, version, pages and effective date", "Owner, last update and freshness so you can trust what you read", "Exact excerpt or record reference, plus anything else worth knowing", "Review whether the sources support the answer with a thumbs up or thumbs down"];

export default function PensionAssistant() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [records, setRecords] = useState<Conversation[]>(sampleConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const speech = useChatSpeech(q, setQ);
  const [files, setFiles] = useState<File[]>([]);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Sources");
  const [exportState, setExportState] = useState<{ id: string; text: string } | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState("");
  const [feedback, setFeedback] = useState<Record<string, { rating: number; note: string; submitted: boolean; support: string; sourceNote?: string; sourceSubmitted?: boolean }>>({});
  const textarea = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const active = records.find((record) => record.id === activeId);
  const review = activeId ? feedback[activeId] : undefined;
  const lastAssistantId = active ? [...active.messages].reverse().find((message) => message.role === "assistant")?.id : undefined;

  useEffect(() => { textarea.current?.focus(); }, [activeId]);
  useEffect(() => { setExportState(null); setExportError(""); }, [activeId, active?.messages.length]);
  useEffect(() => { if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }, [activeId, active?.messages.length]);
  const reset = () => { speech.stop(); speech.clearError(); setActiveId(null); setQ(""); setFiles([]); setTab("Sources"); setDetailsOpen(false); textarea.current?.focus(); };
  const select = (id: string) => { speech.stop(); speech.clearError(); setActiveId(id); setQ(""); setFiles([]); setTab("Sources"); setDetailsOpen(false); if (window.innerWidth < 768) setHistoryOpen(false); };
  const updateReview = (change: Partial<NonNullable<typeof review>>) => {
    if (!activeId) return;
    setFeedback((previous) => ({ ...previous, [activeId]: { ...(previous[activeId] ?? { rating: 0, note: "", submitted: false, support: "" }), ...change } }));
  };
  const send = () => {
    const text = q.trim();
    if (!text) return;
    speech.stop(); speech.clearError();
    const messages: Conversation["messages"] = [
      { id: crypto.randomUUID(), role: "user", text },
      { id: crypto.randomUUID(), role: "assistant", text: dummyResponse },
    ];
    if (active) {
      setRecords((previous) => previous.map((record) => record.id === active.id ? { ...record, messages: [...record.messages, ...messages], confidence: null } : record));
    } else {
      const id = crypto.randomUUID();
      setRecords((previous) => [{ id, title: summarizeFirstMessage(text), messages, sources: [], reasoning: [], validation: [], confidence: null }, ...previous]);
      setActiveId(id);
      void generateHistoryTitle(text).then((title) => {
        const resolvedTitle = title.trim() || summarizeFirstMessage(text);
        setRecords((previous) => previous.map((record) => record.id === id ? { ...record, title: resolvedTitle } : record));
      }).catch(() => {
        // Retain the local summary if the future AI service is unavailable.
      });
    }
    setQ(""); textarea.current?.focus();
  };
  const download = async () => {
    if (!active || exportBusy) return;
    if (exportState?.id === active.id) {
      downloadChatText(exportState.text, getChatExportFilename(active.title));
      setExportState(null);
      return;
    }
    setExportBusy(true); setExportError("");
    const started = performance.now();
    try {
      const text = formatChatExport(active, await getExportServerTime());
      // Keep a synchronous second click for touch devices or slow requests.
      if (matchMedia("(pointer: coarse)").matches || performance.now() - started > 900) setExportState({ id: active.id, text });
      else downloadChatText(text, getChatExportFilename(active.title));
    } catch {
      setExportError("Could not get the server time. Please try downloading again.");
    } finally { setExportBusy(false); }
  };

  return <div className="assistant-app">
    <header className="assistant-header">
      <div className="brand-lockup"><div className="brand-avatar">{getBotInitials()}</div><div><strong>{BOT_NAME}</strong><small>APTIA COLLEAGUE ASSIST</small></div></div>
      <nav>{["Prompting guide", `What can I ask ${getBotInitials()}?`, "FAQs", "Contact us"].map((label) => <a key={label} href="#">{label}</a>)}</nav>
      <Button className="details-toggle" aria-label="Toggle answer details" title="Answer details" onClick={() => setDetailsOpen(!detailsOpen)}><PanelRight size={18}/></Button>
    </header>
    <div className="assistant-body">
      <aside className="icon-rail">
        <Button className={historyOpen ? "rail-button selected" : "rail-button"} aria-label="History" title="History" aria-expanded={historyOpen} aria-controls="conversation-history" onClick={() => setHistoryOpen(!historyOpen)}><History size={16}/></Button>
        <Button className="rail-button" aria-label="New chat" title="New chat" onClick={reset}><Plus size={16}/></Button>
      </aside>
      {historyOpen && <aside className="history-sidebar" id="conversation-history" aria-label="Conversation history">
        <div className="history-heading"><h2>History</h2><Button aria-label="Close history" title="Close history" onClick={() => setHistoryOpen(false)}><X size={15}/></Button></div>
        <label className="history-search"><Search size={14}/><input aria-label="Search conversations" placeholder="Search conversations..." value={search} onChange={(event) => setSearch(event.target.value)}/></label>
        <div className="history-list">{records.filter((record) => record.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
          const order = ["bereavement", "weir-npa", "b-khan-lrf", "jlr-spouse", "weir-late", "weir-barber", "early-retirement"];
          const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
          return ai === -1 ? -1 : bi === -1 ? 1 : ai - bi;
        }).map((record) => <Button key={record.id} className={`history-item ${activeId === record.id ? "selected" : ""}`} aria-pressed={activeId === record.id} title={record.title} onClick={() => select(record.id)}><MessageSquare size={13}/><span>{record.title}</span></Button>)}
        {!records.some((record) => record.title.toLowerCase().includes(search.toLowerCase())) && <p className="search-empty">No conversations found.</p>}</div>
      </aside>}
      <main className="chat-main">
        {!active ? <div className="chat-welcome"><div className="welcome-avatar">{getBotInitials()}</div><h1>Pension Colleague Assistant</h1><p>Please provide the scheme name and, for member-specific queries,<br className="desktop-break"/> the member's National Insurance number.</p></div> : <>
          <div className="transcript-toolbar">{exportError && <span role="alert">{exportError}</span>}<Button onClick={download} disabled={exportBusy}><Download size={13}/>{exportBusy ? "Preparing…" : exportState?.id === active.id ? "Save chat file" : "Download chat"}</Button></div>
          <div className="chat-transcript" ref={transcript} aria-label="Conversation messages">
            {active.messages.map((message) => message.role === "user" ? <div key={message.id} className="user-message">{message.text}</div> : <article className="assistant-message" key={message.id}>
              <div className="answer-label"><ShieldCheck size={12}/><span>Recommendation — for human review</span>{active.confidence !== null && <span className="confidence">{active.confidence}% confidence</span>}</div>
              <div className="answer-text">{message.text}</div>
              {message.id === lastAssistantId && (review?.submitted ? <div className="answer-feedback submitted"><p role="status">Thanks — you rated this {review.rating}/5.</p></div> : <form className="answer-feedback" onSubmit={(event) => { event.preventDefault(); updateReview({ submitted: true }); }}>
                <p>How correct and relevant was this answer? (1 = incorrect, 5 = fully correct)</p>
                <div className="rating-options">{[1,2,3,4,5].map((rating) => <Button key={rating} aria-label={`Rate answer ${rating}`} aria-pressed={review?.rating === rating} className={review?.rating === rating ? "selected" : ""} onClick={() => updateReview({ rating, submitted: false })}>{rating}</Button>)}</div>
                <textarea aria-label="Answer feedback" placeholder="Tell us what was right or wrong (optional)..." value={review?.note ?? ""} onChange={(event) => updateReview({ note: event.target.value, submitted: false })}/>
                <Button type="submit" className="feedback-submit" disabled={!review?.rating}>Submit feedback</Button>
              </form>)}
            </article>)}
          </div>
        </>}
         <div className="composer-area"><form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send(); }}><textarea ref={textarea} aria-label="Ask a question" placeholder={speech.listening ? "Listening…" : "Ask a question..."} value={q} onChange={(event) => { speech.stop(); setQ(event.target.value); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }}/><Button className={`mic-button ${speech.listening ? "listening" : ""}`} aria-label={speech.listening ? "Stop voice input" : "Start voice input"} aria-pressed={speech.listening} title={speech.listening ? "Stop voice input" : "Voice input — your browser processes speech"} onClick={speech.toggle}>{speech.listening ? <Square size={14}/> : <Mic size={17}/>}</Button><Button type="submit" className="send-button" aria-label="Send" title="Send" disabled={!q.trim()}><ArrowUp size={17}/></Button></form>
         {speech.error && <p className="speech-status" role="alert">{speech.error}</p>}
        <div className="composer-tools"><ChatAttachments files={files} onFilesChange={setFiles}/><ChatMode/></div></div>
      </main>
      <section className={`answer-panel ${detailsOpen ? "details-open" : ""}`} aria-label="Answer details">
        <div className="answer-tabs"><div className="answer-tab-group" role="tablist">{tabs.map((name) => <Button key={name} role="tab" aria-selected={tab === name} aria-controls="answer-details-content" className={tab === name ? "selected" : ""} onClick={() => setTab(name)}>{name}{name === "Sources" && active?.sources.length ? ` (${active.sources.length})` : ""}</Button>)}</div></div>
        <div className="answer-panel-content" id="answer-details-content" role="tabpanel" aria-label={tab}>
          {!active || (tab === "Sources" ? !active.sources.length : tab === "How it answered" ? !active.reasoning.length : !active.validation.length) ? <div className="sources-empty"><div className="sources-avatar"><BookOpenCheck size={19}/></div><h2>{tab === "Sources" ? "Sources behind the answer" : tab}</h2><p>Appears here once you ask a question.</p>{tab === "Sources" && <ul>{points.map((point) => <li key={point}><span/>{point}</li>)}</ul>}</div> : tab === "Sources" ? <>
            {active.sources.map((source) => <article className="source-card" key={source.id}><div className="source-heading">{source.kind === "record" ? <Database size={15}/> : <FileText size={15}/>}<h2>{source.title}</h2><span className="source-status">{source.status}</span></div><dl className="source-fields">{source.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><blockquote>{source.excerpt}</blockquote></article>)}
            <div className="source-review"><div role="group" aria-label="Do these sources support the answer?">{([["Supports", ThumbsUp], ["Does not support", ThumbsDown]] as const).map(([label, Icon]) => <Button key={label} className={review?.support === label ? "selected" : ""} aria-label={label} title={label} aria-pressed={review?.support === label} onClick={() => updateReview({ support: label, sourceSubmitted: false })}><Icon size={14}/></Button>)}</div>
              {review?.support === "Does not support" && (review.sourceSubmitted ? <p role="status" className="source-thanks">Thanks — your feedback was sent.</p> : <form className="source-feedback-form" onSubmit={(event) => { event.preventDefault(); const comment = (review.sourceNote ?? "").trim(); if (!comment || !activeId) return; void submitSourceFeedback({ conversationId: activeId, support: "Does not support", comment }).then(() => updateReview({ sourceSubmitted: true })); }}>
                <textarea aria-label="Source feedback" placeholder="What's wrong with these sources?" value={review.sourceNote ?? ""} onChange={(event) => updateReview({ sourceNote: event.target.value })}/>
                <Button type="submit" disabled={!(review.sourceNote ?? "").trim()}>Submit</Button>
              </form>)}
            </div>
          </> : tab === "How it answered" ? <ReasoningView conversation={active}/> : <ValidationView conversation={active}/>}
        </div>
      </section>
    </div>
  </div>;
}
