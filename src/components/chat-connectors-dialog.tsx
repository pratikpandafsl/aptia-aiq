import { useEffect, useRef } from "react";
import { Link, X } from "lucide-react";
import { ChatButton as Button } from "./chat-button";

export function ChatConnectorsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);

  return <dialog ref={dialog} className="connectors-dialog" aria-labelledby="connectors-title" aria-describedby="connectors-description" onCancel={onClose} onClose={onClose} onClick={(event) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <div className="connectors-heading"><h2 id="connectors-title">Connectors</h2><Button aria-label="Close connectors" title="Close connectors" onClick={onClose}><X size={12}/></Button></div>
    <p id="connectors-description">No data sources are connected to this chat yet.</p>
    <div className="connectors-empty-icon"><Link size={22}/></div>
  </dialog>;
}