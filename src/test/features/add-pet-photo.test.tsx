import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorFeedbackProvider } from "../../components/ui/error-feedback/ErrorFeedback";
import { AddPetScreen } from "../../features/pets/tela-07a-adicionar-pet/Screen";

function renderScreen() {
  return render(
    <ErrorFeedbackProvider>
      <AddPetScreen onBack={vi.fn()} />
    </ErrorFeedbackProvider>,
  );
}

describe("foto no cadastro do pet", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:foto-do-pet"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("abre as opções de galeria e câmera pelo botão de adicionar foto", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: "Adicionar foto do pet" }));

    expect(screen.getByRole("dialog", { name: "Adicionar foto do pet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escolher da galeria" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tirar foto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();

    expect(screen.getByTestId("pet-photo-gallery-input")).toHaveAttribute("accept", "image/*");
    expect(screen.getByTestId("pet-photo-gallery-input")).not.toHaveAttribute("capture");
    expect(screen.getByTestId("pet-photo-camera-input")).toHaveAttribute("accept", "image/*");
    expect(screen.getByTestId("pet-photo-camera-input")).toHaveAttribute("capture", "environment");
  });

  it("mostra a imagem escolhida e mantém o botão disponível para troca", async () => {
    const user = userEvent.setup();
    renderScreen();
    const file = new File(["imagem"], "balu.png", { type: "image/png" });

    await user.upload(screen.getByTestId("pet-photo-gallery-input"), file);

    expect(screen.getByRole("img", { name: "Foto selecionada do pet" })).toHaveAttribute(
      "src",
      "blob:foto-do-pet",
    );
    expect(screen.getByRole("button", { name: "Adicionar foto do pet" })).toBeInTheDocument();
  });

  it("rejeita arquivo que não seja uma imagem pelo feedback global", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderScreen();
    const file = new File(["texto"], "anotacoes.txt", { type: "text/plain" });

    await user.upload(screen.getByTestId("pet-photo-gallery-input"), file);

    expect(screen.getByRole("alert")).toHaveTextContent("Selecione um arquivo de imagem válido.");
    expect(screen.queryByRole("img", { name: "Foto selecionada do pet" })).not.toBeInTheDocument();
  });

  it("cancela sem alterar o avatar e devolve o foco ao botão de foto", async () => {
    const user = userEvent.setup();
    renderScreen();
    const addPhotoButton = screen.getByRole("button", { name: "Adicionar foto do pet" });

    await user.click(addPhotoButton);
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog", { name: "Adicionar foto do pet" })).not.toBeInTheDocument();
    expect(addPhotoButton).toHaveFocus();
    expect(screen.queryByRole("img", { name: "Foto selecionada do pet" })).not.toBeInTheDocument();
  });

  it("fecha o menu com Escape e devolve o foco ao botão de foto", async () => {
    const user = userEvent.setup();
    renderScreen();
    const addPhotoButton = screen.getByRole("button", { name: "Adicionar foto do pet" });

    await user.click(addPhotoButton);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Adicionar foto do pet" })).not.toBeInTheDocument();
    expect(addPhotoButton).toHaveFocus();
  });
});
