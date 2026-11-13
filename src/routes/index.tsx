import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Plus, SlidersHorizontal, ChevronDown, ArrowUp, BookOpenCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aptia's IQ — Pension Colleague Assistant" },
      { name: "description", content: "AIQ helps pension colleagues answer scheme and member queries with cited sources." },
      { property: "og:title", content: "Aptia's IQ — Pension Colleague Assistant" },
      { property: "og:description", content: "AIQ helps pension colleagues answer scheme and member queries with cited sources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const tabs = ["Sources", "How it answered", "Validation"] as const;
const points = [
  "Documents and data records cited, with file name, version, pages and effective date",
  "Owner, last update and freshness so you can trust what you read",
  "Exact excerpt or record reference, plus anything else worth knowing",
  "Review whether the sources support the answer: Supports, Does not support or Unclear",
];

function Index() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Sources");
  const [q, setQ] = useState("");
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chat text-xs font-bold text-brand">AIQ</div>
          <div className="leading-tight">
            <div className="text-sm font-bold">Aptia's IQ</div>
            <div className="text-[10px] tracking-wider text-muted-foreground">APTIA COLLEAGUE ASSIST</div>
          </div>
        </div>
        <nav className="hidden gap-7 text-xs md:flex">
          {["Prompting guide", "What can I ask AIQ?", "FAQs", "Contact us"].map((l) => (
            <a key={l} href="#" className="hover:text-brand">{l}</a>
          ))}
        </nav>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-12 shrink-0 flex-col items-center gap-6 border-r pt-6 text-muted-foreground">
          <button aria-label="History"><History className="h-4 w-4" /></button>
          <button aria-label="New chat"><Plus className="h-4 w-4" /></button>
        </aside>
        <main className="flex flex-1 flex-col bg-[image:var(--gradient-chat)] px-8 pb-4 text-chat-foreground">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-chat-foreground/10 text-sm font-bold text-brand">AIQ</div>
            <h1 className="text-lg font-semibold">Pension Colleague Assistant</h1>
            <p className="mt-1 max-w-sm text-xs text-chat-foreground/60">
              Please provide the scheme name and, for member-specific queries, the member's National Insurance number.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setQ(""); }} className="flex items-end rounded-2xl border border-brand/50 bg-chat-foreground/5 p-4">
            <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={1} placeholder="Ask a question..."
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-chat-foreground/50" />
            <button aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-strong text-chat-foreground">
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-4 flex items-center gap-5 px-2 text-xs text-chat-foreground/80">
            <Plus className="h-4 w-4" /><SlidersHorizontal className="h-4 w-4" />
            <span className="flex items-center gap-6">Standard <ChevronDown className="h-3.5 w-3.5" /></span>
          </div>
        </main>
        <section className="hidden w-1/2 flex-col bg-muted lg:flex">
          <div className="border-b bg-background px-5 py-3">
            <div className="inline-flex rounded-xl bg-muted p-1 text-sm">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`rounded-lg px-3 py-1 ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center pt-20 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand-strong"><BookOpenCheck className="h-4 w-4" /></div>
            <h2 className="mt-4 text-sm font-semibold">{tab === "Sources" ? "Sources behind the answer" : tab === "Validation" ? "Validation" : "How it answered"}</h2>
            <p className="text-xs text-muted-foreground">Appears here once you ask a question.</p>
            {tab === "Sources" && (
              <ul className="mt-6 w-[400px] space-y-2 text-left text-xs text-muted-foreground">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 rounded-xl border border-dashed bg-background px-3 py-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
