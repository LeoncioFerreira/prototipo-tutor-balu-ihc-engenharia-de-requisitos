import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorFeedbackProvider } from "../../components/ui/error-feedback/ErrorFeedback";
import { RegisterPetScreen } from "../../features/acesso/tela-03-cadastrar-pet/Screen";
import { AddPetScreen } from "../../features/pets/tela-07a-adicionar-pet/Screen";

function renderScreen() {
  return render(
    <ErrorFeedbackProvider>
      <AddPetScreen onBack={vi.fn()} />
    </ErrorFeedbackProvider>,
  );
}

function renderOnboardingScreen() {
  return render(
    <ErrorFeedbackProvider>
      <RegisterPetScreen onBack={vi.fn()} />
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

  it("move e mantém o foco dentro do menu de foto", async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole("button", { name: "Adicionar foto do pet" }));

    const galleryButton = screen.getByRole("button", { name: "Escolher da galeria" });
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    expect(galleryButton).toHaveFocus();

    cancelButton.focus();
    await user.tab();
    expect(galleryButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(cancelButton).toHaveFocus();
  });

  it("fecha o menu por interação de ponteiro fora dele", async () => {
    const user = userEvent.setup();
    renderScreen();
    const addPhotoButton = screen.getByRole("button", { name: "Adicionar foto do pet" });

    await user.click(addPhotoButton);
    const dialog = screen.getByRole("dialog", { name: "Adicionar foto do pet" });
    const backdrop = dialog.parentElement;
    expect(backdrop).not.toBeNull();

    fireEvent.pointerDown(backdrop!);

    expect(screen.queryByRole("dialog", { name: "Adicionar foto do pet" })).not.toBeInTheDocument();
    expect(addPhotoButton).toHaveFocus();
  });

  it("libera as URLs temporárias ao trocar a foto e desmontar", async () => {
    const user = userEvent.setup();
    vi.mocked(URL.createObjectURL)
      .mockReturnValueOnce("blob:primeira-foto")
      .mockReturnValueOnce("blob:segunda-foto");
    const rendered = renderScreen();
    const input = screen.getByTestId("pet-photo-gallery-input");

    await user.upload(input, new File(["1"], "primeira.png", { type: "image/png" }));
    await user.upload(input, new File(["2"], "segunda.png", { type: "image/png" }));

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:primeira-foto");
    rendered.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:segunda-foto");
  });

  it("oferece galeria e câmera também no cadastro inicial", async () => {
    const user = userEvent.setup();
    renderOnboardingScreen();

    await user.click(screen.getByRole("button", { name: "Adicionar foto do pet" }));

    expect(screen.getByRole("dialog", { name: "Adicionar foto do pet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Escolher da galeria" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tirar foto" })).toBeInTheDocument();
    expect(screen.getByTestId("pet-photo-camera-input")).toHaveAttribute("capture", "environment");
  });

  it("mostra a foto escolhida no cadastro inicial", async () => {
    const user = userEvent.setup();
    renderOnboardingScreen();
    const file = new File(["imagem"], "balu.png", { type: "image/png" });

    await user.upload(screen.getByTestId("pet-photo-gallery-input"), file);

    expect(screen.getByRole("img", { name: "Foto selecionada do pet" })).toHaveAttribute(
      "src",
      "blob:foto-do-pet",
    );
  });

  it("rejeita arquivo inválido no cadastro inicial", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderOnboardingScreen();
    const file = new File(["texto"], "anotacoes.txt", { type: "text/plain" });

    await user.upload(screen.getByTestId("pet-photo-gallery-input"), file);

    expect(screen.getByRole("alert")).toHaveTextContent("Selecione um arquivo de imagem válido.");
    expect(screen.queryByRole("img", { name: "Foto selecionada do pet" })).not.toBeInTheDocument();
  });
});
