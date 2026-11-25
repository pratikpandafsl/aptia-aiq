import { createFileRoute } from "@tanstack/react-router";
import { ColleagueHome } from "../components/colleague-portal";
import { DemoGate } from "../components/demo-access";
import { BOT_NAME } from "../lib/chat-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BOT_NAME} — Colleague Workspace` },
      { name: "description", content: "Your Aptia colleague workspace with pension updates, scheme knowledge and the AIQ assistant." },
      { property: "og:title", content: `${BOT_NAME} — Colleague Workspace` },
      { property: "og:description", content: "Your Aptia colleague workspace with pension updates, scheme knowledge and the AIQ assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DemoGate><ColleagueHome/></DemoGate>,
});

