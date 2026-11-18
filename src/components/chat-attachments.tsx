import { useEffect, useRef, useState } from "react";
import { FileText, Link, Paperclip, Plus, X } from "lucide-react";
import { ChatButton as Button } from "./chat-button";
import { ChatConnectorsDialog } from "./chat-connectors-dialog";

interface ChatAttachmentsProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

// Files stay local to this prototype; pass them to your future API when connected.
export function ChatAttachments({ files, onFilesChange }: ChatAttachmentsProps) {
  const [open, setOpen] = useState(false);
  const [connectorsOpen, setConnectorsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [open]);

  return <>
    {files.length > 0 && <ul className="attachment-list" aria-label="Attached files">{files.map((file, index) => <li key={`${file.name}-${file.size}-${file.lastModified}`} className="attachment-chip">
      <FileText size={12}/><span title={file.name}>{file.name}</span><Button aria-label={`Remove ${file.name}`} title={`Remove ${file.name}`} onClick={() => onFilesChange(files.filter((_, i) => i !== index))}><X size={12}/></Button>
    </li>)}</ul>}
    <div className="attachment-control" ref={container}>
      <Button className="attachment-trigger" aria-label="Add attachments" title="Add attachments" aria-expanded={open} aria-haspopup="menu" onClick={(event) => { trigger.current = event.currentTarget; setOpen(!open); }}><Plus size={15}/></Button>
      {open && <div className="attachment-menu" role="menu" aria-label="Attachments">
        <Button role="menuitem" onClick={() => { setOpen(false); input.current?.click(); }}><Paperclip size={14}/>Add files</Button>
        <Button role="menuitem" onClick={() => { setOpen(false); setConnectorsOpen(true); }}><Link size={14}/>Connectors</Button>
      </div>}
      <input ref={input} type="file" multiple hidden aria-label="Add files" onChange={(event) => {
        const selected = Array.from(event.currentTarget.files ?? []);
        const merged = [...files];
        for (const file of selected) {
          if (!merged.some((existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) merged.push(file);
        }
        onFilesChange(merged);
        event.currentTarget.value = "";
      }}/>
    </div>
    <ChatConnectorsDialog open={connectorsOpen} onClose={() => { setConnectorsOpen(false); trigger.current?.focus(); }}/>
  </>;
}