import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  ErrorFeedbackProvider,
  useErrorFeedback,
} from "../../components/ui/error-feedback/ErrorFeedback";

function FeedbackHarness({ onRetry = () => undefined }: { onRetry?: () => void }) {
  const { showModal, showToast } = useErrorFeedback();

  return (
    <>
      <button type="button" onClick={() => showToast("Erro temporário")}>
        Mostrar toast
      </button>
      <button
        type="button"
        onClick={() =>
          showModal({
            title: "Falha ao carregar",
            message: "Não foi possível concluir.",
            action: { label: "Tentar novamente", onClick: onRetry },
          })
        }
      >
        Primeiro modal
      </button>
      <button
        type="button"
        onClick={() => showModal({ title: "Segundo erro", message: "Mensagem atualizada." })}
      >
        Segundo modal
      </button>
    </>
  );
}

test("remove o toast automaticamente depois de quatro segundos", () => {
  vi.useFakeTimers();
  render(
    <ErrorFeedbackProvider>
      <FeedbackHarness />
    </ErrorFeedbackProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: /mostrar toast/i }));
  expect(screen.getByRole("alert")).toHaveTextContent("Erro temporário");

  act(() => vi.advanceTimersByTime(4_000));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  vi.useRealTimers();
});

test("executa a ação opcional do modal e o fecha", () => {
  const onRetry = vi.fn();
  render(
    <ErrorFeedbackProvider>
      <FeedbackHarness onRetry={onRetry} />
    </ErrorFeedbackProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: /primeiro modal/i }));
  fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));

  expect(onRetry).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("mantém apenas o modal mais recente e devolve o foco ao fechar", () => {
  render(
    <ErrorFeedbackProvider>
      <FeedbackHarness />
    </ErrorFeedbackProvider>,
  );
  const secondTrigger = screen.getByRole("button", { name: /segundo modal/i });

  fireEvent.click(screen.getByRole("button", { name: /primeiro modal/i }));
  secondTrigger.focus();
  fireEvent.click(secondTrigger);

  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByRole("dialog")).toHaveAccessibleName("Segundo erro");
  fireEvent.click(screen.getByRole("button", { name: /entendi/i }));
  expect(secondTrigger).toHaveFocus();
});
