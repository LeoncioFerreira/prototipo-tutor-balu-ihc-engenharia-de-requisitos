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

test("conclui uma tarefa pela caixa de seleção", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getByRole("checkbox", { name: /vermífugo chemital/i })).toBeChecked();
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

test("marca um cuidado sem depender de uma imagem de tela", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getByRole("checkbox", { name: /vermífugo chemital/i })).toBeChecked();
  expect(screen.getByText(/nível 4/i)).toBeInTheDocument();
});

test("avança pelo fluxo de cadastro até escolher a experiência", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /criar conta/i }));
  await user.type(screen.getByLabelText(/^nome$/i), "Leôncio");
  await user.type(screen.getByLabelText(/^e-mail$/i), "leoncio@email.com");
  await user.type(screen.getByLabelText(/^senha$/i), "12345678");
  await user.type(screen.getByLabelText(/confirmar senha/i), "12345678");
  await user.click(screen.getByRole("button", { name: /^criar conta$/i }));
  expect(screen.getByRole("heading", { name: /cadastrar pet/i })).toBeInTheDocument();
  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.click(screen.getByRole("button", { name: /continuar/i }));
  expect(screen.getByText(/experiência gamificada/i)).toBeInTheDocument();
});

test("avança do login para criação de conta", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /criar conta/i }));
  expect(screen.getByRole("heading", { name: /criar conta/i })).toBeInTheDocument();
});
