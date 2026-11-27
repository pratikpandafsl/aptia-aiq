import { createFileRoute } from "@tanstack/react-router";
import { PromptingGuide } from "../components/prompting-guide";

export const Route = createFileRoute("/prompting-guide")({
  head: () => ({ meta: [
    { title: "Prompting guide — Aptia's IQ" },
    { name: "description", content: "Prepare clear pension queries with scheme details, relevant member context and example prompts for Aptia's IQ." },
    { property: "og:title", content: "Prompting guide — Aptia's IQ" },
    { property: "og:description", content: "Prepare clear pension queries with scheme details, relevant member context and example prompts for Aptia's IQ." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: GuidePage,
});

function GuidePage() {
  const navigate = Route.useNavigate();
  return <PromptingGuide onBack={() => void navigate({ to: "/" })}/>;
}