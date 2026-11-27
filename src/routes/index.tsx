import { createFileRoute } from "@tanstack/react-router";
import PensionAssistant from "../components/pension-assistant";

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
  component: AssistantPage,
});

function AssistantPage() {
  const navigate = Route.useNavigate();
  return <PensionAssistant onPromptingGuide={() => void navigate({ to: "/prompting-guide" })}/>;
}

