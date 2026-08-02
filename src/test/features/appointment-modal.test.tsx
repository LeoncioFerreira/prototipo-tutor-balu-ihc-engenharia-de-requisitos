import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ErrorFeedbackProvider } from "../../components/ui/error-feedback/ErrorFeedback";
import { AppointmentModal } from "../../features/pets/tela-07-meus-pets/AppointmentModal";

function renderModal() {
  const onClose = vi.fn();
  render(
    <ErrorFeedbackProvider>
      <AppointmentModal
        petName="Balu"
        onClose={onClose}
        returnFocusRef={createRef<HTMLButtonElement>()}
        today={new Date(2026, 7, 2, 12)}
      />
    </ErrorFeedbackProvider>,
  );
  return onClose;
}

test("exibe o formulário e navega entre os meses sem liberar datas passadas", async () => {
  const user = userEvent.setup();
  renderModal();

  expect(screen.getByRole("dialog", { name: "Marcar consulta" })).toBeInTheDocument();
  expect(document.querySelector(".appointment-modal__reason-label")).toHaveTextContent(
    "Motivo da consulta *",
  );
  expect(screen.getByLabelText("Motivo da consulta")).toBeRequired();
  expect(screen.getByText("agosto de 2026", { exact: false })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "1 de agosto de 2026" })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Próximo mês" }));
  expect(screen.getByText("setembro de 2026", { exact: false })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Mês anterior" }));
  expect(screen.getByText("agosto de 2026", { exact: false })).toBeInTheDocument();
});

test("valida os campos e confirma a consulta com um resumo", async () => {
  const user = userEvent.setup();
  renderModal();

  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(
    screen.getByText("Preencha o motivo, escolha uma data e um horário para continuar."),
  ).toBeInTheDocument();

  await user.type(screen.getByLabelText("Motivo da consulta"), "Vacinação anual");
  await user.click(screen.getByRole("button", { name: "2 de agosto de 2026" }));
  expect(screen.getByRole("heading", { name: "Horários disponíveis" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "08:00" }));

  await user.click(screen.getByRole("button", { name: "3 de agosto de 2026" }));
  expect(screen.queryByRole("button", { name: "08:00" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "09:30" }));
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));

  expect(screen.getByRole("heading", { name: "Consulta solicitada" })).toBeInTheDocument();
  expect(screen.getByText("Balu")).toBeInTheDocument();
  expect(screen.getByText("3 de agosto de 2026")).toBeInTheDocument();
  expect(screen.getByText("09:30")).toBeInTheDocument();
  expect(screen.getByText("Vacinação anual")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Concluir" })).toBeInTheDocument();
});
