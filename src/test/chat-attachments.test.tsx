import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ChatAttachments } from "../components/chat-attachments";

afterEach(cleanup);

function AttachmentHarness() {
  const [files, setFiles] = useState<File[]>([]);
  return <ChatAttachments files={files} onFilesChange={setFiles}/>;
}

it("keeps multiple selected files and allows removing an individual file", () => {
  render(<AttachmentHarness/>);
  const first = new File(["first"], "first.txt");
  const second = new File(["second"], "second.txt");
  fireEvent.change(screen.getByLabelText("Add files"), { target: { files: [first, second] } });
  expect(screen.getByRole("button", { name: "Remove first.txt" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Remove second.txt" })).toBeEnabled();
  fireEvent.click(screen.getByRole("button", { name: "Remove first.txt" }));
  expect(screen.queryByRole("button", { name: "Remove first.txt" })).toBeNull();
  expect(screen.getByRole("button", { name: "Remove second.txt" })).toBeEnabled();
});