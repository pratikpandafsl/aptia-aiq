import { useEffect, useRef, useState } from "react";
import { History, Plus, SlidersHorizontal, ChevronDown, ArrowUp, BookOpenCheck, X, Search, MessageSquare, Database, FileText, Download, ThumbsUp, ThumbsDown, CircleHelp, ShieldCheck, PanelRight } from "lucide-react";
import { conversations as sampleConversations } from "../data.js";
import type { Conversation } from "./chat-types";
import { ChatButton as Button } from "./chat-button";
import { ReasoningView, ValidationView } from "./answer-detail-views";
import { downloadChatText, formatChatExport, getExportServerTime } from "../lib/chat-export";

const tabs = ["Sources", "How it answered", "Validation"] as const;
const points = ["Documents and data records cited, with file name, version, pages and effective date", "Owner, last update and freshness so you can trust what you read", "Exact excerpt or record reference, plus anything else worth knowing", "Review whether the sources support the answer: Supports, Does not support or Unclear"];

export default function PensionAssistant() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [records, setRecords] = useState<Conversation[]>(sampleConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof tabs)[number]>("Sources");
  const [exportState, setExportState] = useState<{ id: string; text: string } | null>(null);
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState("");
  const [feedback, setFeedback] = useState<Record<string, { rating: number; note: string; submitted: boolean; support: string }>>({});
  const textarea = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const active = records.find((record) => record.id === activeId);
  const review = activeId ? feedback[activeId] : undefined;

  useEffect(() => { textarea.current?.focus(); }, [activeId]);
  useEffect(() => { setExportState(null); setExportError(""); }, [activeId, active?.messages.length]);
  useEffect(() => { if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }, [activeId, active?.messages.length]);
  const reset = () => { setActiveId(null); setQ(""); setTab("Sources"); setDetailsOpen(false); textarea.current?.focus(); };
  const select = (id: string) => { setActiveId(id); setQ(""); setTab("Sources"); setDetailsOpen(false); if (window.innerWidth < 768) setHistoryOpen(false); };
  const updateReview = (change: Partial<NonNullable<typeof review>>) => {
    if (!activeId) return;
    setFeedback((previous) => ({ ...previous, [activeId]: { ...(previous[activeId] ?? { rating: 0, note: "", submitted: false, support: "" }), ...change } }));
  };
  const send = () => {
    const text = q.trim();
    if (!text) return;
    if (active) {
      setRecords((previous) => previous.map((record) => record.id === active.id ? { ...record, messages: [...record.messages, { id: crypto.randomUUID(), role: "user", text }] } : record));
    } else {
      const id = crypto.randomUUID();
      setRecords((previous) => [{ id, title: text.slice(0, 70), messages: [{ id: crypto.randomUUID(), role: "user", text }], sources: [], reasoning: [], validation: [], confidence: null }, ...previous]);
      setActiveId(id);
    }
    setQ(""); textarea.current?.focus();
  };
  const download = async () => {
    if (!active || exportBusy) return;
    if (exportState?.id === active.id) {
      downloadChatText(exportState.text, `${active.id}.txt`);
      setExportState(null);
      return;
    }
    setExportBusy(true); setExportError("");
    const started = performance.now();
    try {
      const text = formatChatExport(active, await getExportServerTime());
      // Keep a synchronous second click for touch devices or slow requests.
      if (matchMedia("(pointer: coarse)").matches || performance.now() - started > 900) setExportState({ id: active.id, text });
      else downloadChatText(text, `${active.id}.txt`);
    } catch {
      setExportError("Could not get the server time. Please try downloading again.");
    } finally { setExportBusy(false); }
  };

  return <div className="assistant-app">
    <header className="assistant-header">
      <div className="brand-lockup"><div className="brand-avatar">AIQ</div><div><strong>Aptia's IQ</strong><small>APTIA COLLEAGUE ASSIST</small></div></div>
      <nav>{["Prompting guide", "What can I ask AIQ?", "FAQs", "Contact us"].map((label) => <a key={label} href="#">{label}</a>)}</nav>
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
        {!active ? <div className="chat-welcome"><div className="welcome-avatar">AIQ</div><h1>Pension Colleague Assistant</h1><p>Please provide the scheme name and, for member-specific queries,<br className="desktop-break"/> the member's National Insurance number.</p></div> : <>
          <div className="transcript-toolbar">{exportError && <span role="alert">{exportError}</span>}<Button onClick={download} disabled={exportBusy}><Download size={13}/>{exportBusy ? "Preparing…" : exportState?.id === active.id ? "Save chat file" : "Download chat"}</Button></div>
          <div className="chat-transcript" ref={transcript} aria-label="Conversation messages">
            {active.messages.map((message) => message.role === "user" ? <div key={message.id} className="user-message">{message.text}</div> : <article className="assistant-message" key={message.id}>
              <div className="answer-label"><ShieldCheck size={12}/><span>Recommendation — for human review</span>{active.confidence !== null && <span className="confidence">{active.confidence}% confidence</span>}</div>
              <div className="answer-text">{message.text}</div>
            </article>)}
            {active.messages.some((message) => message.role === "assistant") && <form className="answer-feedback" onSubmit={(event) => { event.preventDefault(); updateReview({ submitted: true }); }}>
              <p>How correct and relevant was this answer? (1 = incorrect, 5 = fully correct)</p>
              <div className="rating-options">{[1,2,3,4,5].map((rating) => <Button key={rating} aria-label={`Rate answer ${rating}`} aria-pressed={review?.rating === rating} className={review?.rating === rating ? "selected" : ""} onClick={() => updateReview({ rating, submitted: false })}>{rating}</Button>)}</div>
              <textarea aria-label="Answer feedback" placeholder="Tell us what was right or wrong (optional)..." value={review?.note ?? ""} onChange={(event) => updateReview({ note: event.target.value, submitted: false })}/>
              <Button type="submit" className="feedback-submit" disabled={!review?.rating}>{review?.submitted ? "Feedback saved" : "Submit feedback"}</Button>
            </form>}
          </div>
        </>}
        <div className="composer-area"><form className="chat-composer" onSubmit={(event) => { event.preventDefault(); send(); }}><textarea ref={textarea} aria-label="Ask a question" placeholder="Ask a question..." value={q} onChange={(event) => setQ(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }}/><Button type="submit" className="send-button" aria-label="Send" title="Send" disabled={!q.trim()}><ArrowUp size={17}/></Button></form>
        <div className="composer-tools"><Plus size={15}/><SlidersHorizontal size={14}/><span>Standard</span><ChevronDown size={13}/></div></div>
      </main>
      <section className={`answer-panel ${detailsOpen ? "details-open" : ""}`} aria-label="Answer details">
        <div className="answer-tabs"><div className="answer-tab-group" role="tablist">{tabs.map((name) => <Button key={name} role="tab" aria-selected={tab === name} aria-controls="answer-details-content" className={tab === name ? "selected" : ""} onClick={() => setTab(name)}>{name}{name === "Sources" && active?.sources.length ? ` (${active.sources.length})` : ""}</Button>)}</div></div>
        <div className="answer-panel-content" id="answer-details-content" role="tabpanel" aria-label={tab}>
          {!active || (tab === "Sources" ? !active.sources.length : tab === "How it answered" ? !active.reasoning.length : !active.validation.length) ? <div className="sources-empty"><div className="sources-avatar"><BookOpenCheck size={19}/></div><h2>{tab === "Sources" ? "Sources behind the answer" : tab}</h2><p>Appears here once you ask a question.</p>{tab === "Sources" && <ul>{points.map((point) => <li key={point}><span/>{point}</li>)}</ul>}</div> : tab === "Sources" ? <>
            {active.sources.map((source) => <article className="source-card" key={source.id}><div className="source-heading">{source.kind === "record" ? <Database size={15}/> : <FileText size={15}/>}<h2>{source.title}</h2><span className="source-status">{source.status}</span></div><dl className="source-fields">{source.fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><blockquote>{source.excerpt}</blockquote></article>)}
            <div className="source-review"><p>Do these sources support the answer?</p><div>{[["Supports", ThumbsUp], ["Does not support", ThumbsDown], ["Unclear", CircleHelp]].map(([label, Icon]) => {
              if (typeof label !== "string" || !Icon || typeof Icon === "string") return null;
              return <Button key={label} className={review?.support === label ? "selected" : ""} aria-pressed={review?.support === label} onClick={() => updateReview({ support: label })}><Icon size={13}/>{label}</Button>;
            })}</div></div>
          </> : tab === "How it answered" ? <ReasoningView conversation={active}/> : <ValidationView conversation={active}/>}
        </div>
      </section>
    </div>
  </div>;
}
