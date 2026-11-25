import { createFileRoute } from "@tanstack/react-router";
import { DemoLogin } from "../components/colleague-portal";
import { BOT_NAME } from "../lib/chat-config";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: `${BOT_NAME} — ZScaler Login` },
    { name: "description", content: "Demo ZScaler sign-in for the Aptia colleague workspace." },
    { property: "og:title", content: `${BOT_NAME} — ZScaler Login` },
    { property: "og:description", content: "Demo ZScaler sign-in for the Aptia colleague workspace." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DemoLogin,
});