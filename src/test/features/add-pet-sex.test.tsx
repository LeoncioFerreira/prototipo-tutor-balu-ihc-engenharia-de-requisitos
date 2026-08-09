import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { ErrorFeedbackProvider } from "../../components/ui/error-feedback/ErrorFeedback";
import { AddPetScreen } from "../../features/pets/tela-07a-adicionar-pet/Screen";

test("limita o sexo do novo pet às opções Macho e Fêmea", async () => {
  const user = userEvent.setup();
  render(
    <ErrorFeedbackProvider>
      <AddPetScreen onBack={vi.fn()} />
    </ErrorFeedbackProvider>,
  );

  const sexSelect = screen.getByRole("combobox", { name: /^sexo/i });
  const options = within(sexSelect).getAllByRole("option");

  expect(sexSelect).toBeRequired();
  expect(sexSelect).toHaveValue("");
  expect(options).toHaveLength(3);
  expect(options[0]).toHaveTextContent("Selecione");
  expect(options[0]).toHaveValue("");
  expect(options[1]).toHaveTextContent("Macho");
  expect(options[2]).toHaveTextContent("Fêmea");

  await user.selectOptions(sexSelect, "Macho");
  expect(sexSelect).toHaveValue("Macho");

  await user.selectOptions(sexSelect, "Fêmea");
  expect(sexSelect).toHaveValue("Fêmea");
});
