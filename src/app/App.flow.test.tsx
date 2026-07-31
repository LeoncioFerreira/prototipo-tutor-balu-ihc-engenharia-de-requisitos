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

test("navega para Comunidades pelo hotspot da barra original", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  await user.click(screen.getAllByRole("button", { name: "Comunidade" })[0]);
  expect(screen.getByRole("img", { name: /tela community do balu/i }).getAttribute("src")).toContain("tela-15.png");
});
