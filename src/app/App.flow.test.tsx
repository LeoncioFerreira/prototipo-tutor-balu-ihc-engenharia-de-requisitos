import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import App from "./App";

test("entra no app e abre o chatbot pelo menu inferior", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("button", { name: /chat/i }));
  expect(screen.getByRole("heading", { name: /converse com balu/i })).toBeInTheDocument();
});

test("mostra ícones Lucide na navegação inferior", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  for (const label of ["Início", "Pets", "Comunidade", "Chat"]) {
    expect(screen.getAllByRole("button", { name: label }).some((button) => button.querySelector("svg"))).toBe(true);
  }
});
