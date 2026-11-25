import { createFileRoute, Link } from "@tanstack/react-router";
import { House } from "lucide-react";
import PensionAssistant from "../components/pension-assistant";
import { DemoGate } from "../components/demo-access";
import { BOT_NAME } from "../lib/chat-config";
export const Route = createFileRoute("/aiq")({
  head: () => ({ meta: [
    { title: `${BOT_NAME} — Pension Colleague Assistant` },
    { name: "description", content: "AIQ helps pension colleagues answer scheme and member queries with cited sources." },
    { property: "og:title", content: `${BOT_NAME} — Pension Colleague Assistant` },
    { property: "og:description", content: "AIQ helps pension colleagues answer scheme and member queries with cited sources." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <DemoGate><PensionAssistant homeLink={<Link to="/" aria-label="Back to home" title="Back to home"><House size={16}/></Link>}/></DemoGate>,
});