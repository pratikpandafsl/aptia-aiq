import type { ButtonHTMLAttributes } from "react";

// Portable button primitive: shared by the hosted preview and plain React export.
export function ChatButton({ className = "", type = "button", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`chat-button ${className}`} {...props} />;
}