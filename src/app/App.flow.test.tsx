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

test("abre uma tela numerada diretamente pela URL", () => {
  window.history.pushState({}, "", "/?tela=10");
  render(<App />);
  expect(screen.getByRole("heading", { name: /medicamentos do pet/i })).toBeInTheDocument();
});

test("mantém a navegação inferior funcional nas telas fiéis ao figma", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("button", { name: "Pets" }));
  expect(screen.getByRole("heading", { name: /meus pets/i })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Início" }));
  expect(screen.getByRole("heading", { name: /olá, leôncio/i })).toBeInTheDocument();
});

test("mostra o frame concluído ao marcar um cuidado", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getByAltText(/tela 5: home do tutor/i)).toHaveAttribute("src", "/assets/figma/tela-05a.png");
});
