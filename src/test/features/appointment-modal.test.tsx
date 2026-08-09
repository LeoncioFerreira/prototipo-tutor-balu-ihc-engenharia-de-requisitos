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
  expect(screen.getByRole("combobox", { name: "Tipo de atendimento" })).toHaveValue("");
  expect(screen.getByRole("combobox", { name: "Tipo de atendimento" })).toBeRequired();
  expect(screen.getByRole("combobox", { name: "Veterinário" })).toHaveValue("");
  expect(screen.getByRole("combobox", { name: "Veterinário" })).toBeRequired();
  expect(
    screen.getByRole("option", { name: "Dra. Mariana — Veterinária do Balu" }),
  ).toBeInTheDocument();
  expect(document.querySelector(".appointment-modal__reason-label")).toHaveTextContent(
    "Motivo da consulta *",
  );
  expect(screen.getByLabelText("Motivo da consulta")).toBeRequired();
  expect(screen.getByRole("heading", { name: "Data da consulta" })).toHaveTextContent(
    "Data da consulta *",
  );
  expect(screen.getByText("agosto de 2026", { exact: false })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "1 de agosto de 2026" })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Próximo mês" }));
  expect(screen.getByText("setembro de 2026", { exact: false })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Mês anterior" }));
  expect(screen.getByText("agosto de 2026", { exact: false })).toBeInTheDocument();
});

test("mostra o tipo de exame progressivamente e permite informar outro", async () => {
  const user = userEvent.setup();
  renderModal();

  expect(screen.queryByRole("combobox", { name: "Tipo de exame" })).not.toBeInTheDocument();
  await user.selectOptions(screen.getByRole("combobox", { name: "Tipo de atendimento" }), "exame");

  const examType = screen.getByRole("combobox", { name: "Tipo de exame" });
  expect(examType).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Hemograma" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Ultrassom" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Raio-X" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Exame dermatológico" })).toBeInTheDocument();

  await user.selectOptions(screen.getByRole("combobox", { name: "Veterinário" }), "mariana");
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Selecione o tipo de exame para continuar.")).toBeInTheDocument();

  await user.selectOptions(examType, "outro");
  const otherExam = screen.getByRole("textbox", { name: "Nome do exame" });
  expect(otherExam).toBeRequired();
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Informe o nome do exame para continuar.")).toBeInTheDocument();
});

test("valida os campos e confirma a consulta com um resumo", async () => {
  const user = userEvent.setup();
  renderModal();

  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Selecione o tipo de atendimento para continuar.")).toBeInTheDocument();

  await user.selectOptions(
    screen.getByRole("combobox", { name: "Tipo de atendimento" }),
    "consulta",
  );
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Selecione o veterinário para continuar.")).toBeInTheDocument();

  await user.selectOptions(screen.getByRole("combobox", { name: "Veterinário" }), "mariana");
  await user.type(screen.getByLabelText("Motivo da consulta"), "Vacinação anual");
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Selecione a data da consulta para continuar.")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "2 de agosto de 2026" }));
  expect(screen.getByRole("heading", { name: "Horário da consulta" })).toHaveTextContent(
    "Horário da consulta *",
  );
  await user.click(screen.getByRole("button", { name: "Confirmar consulta" }));
  expect(screen.getByText("Selecione o horário da consulta para continuar.")).toBeInTheDocument();
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
  expect(screen.getByText("Dra. Mariana — Veterinária do Balu")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Concluir" })).toBeInTheDocument();
});
