import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import App from "./App";

test("entra no app e abre o chatbot pelo menu inferior", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("button", { name: /chat/i }));
  expect(screen.getByRole("heading", { name: /conversa com balu/i })).toBeInTheDocument();
});

test("conclui uma tarefa e atualiza o XP", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getByText(/nível 4/i)).toBeInTheDocument();
});
