import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ChatMode } from "../components/chat-mode";

afterEach(cleanup);

it("defaults to Standard and switches between Simple, Standard and Complex", () => {
  render(<ChatMode/>);
  fireEvent.click(screen.getByRole("button", { name: "Response mode: Standard" }));
  expect(screen.getByRole("menuitemradio", { name: "Standard" })).toHaveAttribute("aria-checked", "true");
  fireEvent.click(screen.getByRole("menuitemradio", { name: "Simple" }));
  expect(screen.queryByRole("menu")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Response mode: Simple" }));
  expect(screen.getByRole("menuitemradio", { name: "Simple" })).toHaveAttribute("aria-checked", "true");
  fireEvent.click(screen.getByRole("menuitemradio", { name: "Complex" }));
  expect(screen.getByRole("button", { name: "Response mode: Complex" })).toHaveAttribute("aria-expanded", "false");
});

it("dismisses on Escape and restores focus to the combined control", () => {
  render(<ChatMode/>);
  const trigger = screen.getByRole("button", { name: "Response mode: Standard" });
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("menu")).toBeNull();
  expect(trigger).toHaveFocus();
});