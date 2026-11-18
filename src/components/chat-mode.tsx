import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { ChatButton as Button } from "./chat-button";

const modes = ["Simple", "Standard", "Complex"] as const;

export function ChatMode() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Standard");
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !container.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <div className="chat-mode" ref={container} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <Button className="chat-mode-trigger" aria-label={`Response mode: ${mode}`} aria-haspopup="menu" aria-expanded={open} onClick={(event) => {
      trigger.current = event.currentTarget;
      setOpen(!open);
    }} onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); }
    }}><SlidersHorizontal size={14}/><span>{mode}</span><ChevronDown size={13}/></Button>
    {open && <div className="chat-mode-menu" role="menu" aria-label="Response mode" ref={menu} onKeyDown={(event) => {
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      let next: number | undefined;
      if (event.key === "ArrowDown") next = (index + 1) % items.length;
      if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = items.length - 1;
      if (next !== undefined) { event.preventDefault(); items[next]?.focus(); }
    }}>{modes.map((option) => <Button key={option} role="menuitemradio" aria-checked={mode === option} onClick={() => {
      setMode(option); setOpen(false); trigger.current?.focus();
    }}><span>{option}</span>{mode === option && <Check size={12}/>}</Button>)}</div>}
  </div>;
}