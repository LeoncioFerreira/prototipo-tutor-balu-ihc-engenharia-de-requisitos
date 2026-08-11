import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// @ts-expect-error Vitest provides Node APIs, while the production tsconfig omits Node types.
import { readFileSync } from "node:fs";
// @ts-expect-error Vitest provides Node APIs, while the production tsconfig omits Node types.
import { join } from "node:path";
import { expect, test, vi } from "vitest";
import App from "../../app/App";
import { pathForScreen } from "../../app/routes";

declare const process: { cwd: () => string };

const registerPetStyles = readFileSync(
  join(process.cwd(), "src/features/acesso/tela-03-cadastrar-pet/Screen.scss"),
  "utf8",
);
const consultationStyles = readFileSync(
  join(process.cwd(), "src/features/pets/tela-07b-consultas/Screen.scss"),
  "utf8",
);
const chatbotStyles = readFileSync(
  join(process.cwd(), "src/features/comunicacao/tela-14-chatbot-balu/Screen.scss"),
  "utf8",
);
const walletStyles = readFileSync(
  join(process.cwd(), "src/features/pets/tela-11-ver-carteira/Screen.scss"),
  "utf8",
);
const medicineStyles = readFileSync(
  join(process.cwd(), "src/features/pets/tela-10-ver-remedios/Screen.scss"),
  "utf8",
);
const routineStyles = readFileSync(
  join(process.cwd(), "src/features/pets/tela-09-ver-rotina/Screen.scss"),
  "utf8",
);
const sharedCareStyles = readFileSync(
  join(process.cwd(), "src/features/pets/tela-12-cuidado-compartilhado/Screen.scss"),
  "utf8",
);
const petSectionHeaderStyles = readFileSync(
  join(process.cwd(), "src/components/ui/PetSectionHeader.scss"),
  "utf8",
);
const homeFrameStyles = readFileSync(
  join(process.cwd(), "src/features/inicio/HomeFrame.scss"),
  "utf8",
);
const caramelClubStyles = readFileSync(
  join(process.cwd(), "src/features/comunidade/tela-16-clube-caramelos/Screen.scss"),
  "utf8",
);
const appleIcon = readFileSync(join(process.cwd(), "public/assets/figma/access/apple.svg"), "utf8");
const loginStyles = readFileSync(
  join(process.cwd(), "src/features/acesso/tela-01-login/Screen.scss"),
  "utf8",
);
const createAccountStyles = readFileSync(
  join(process.cwd(), "src/features/acesso/tela-02-criar-conta/Screen.scss"),
  "utf8",
);
const accountSettingsStyles = readFileSync(
  join(process.cwd(), "src/features/inicio/tela-06c-configuracoes-conta/Screen.scss"),
  "utf8",
);
const mobileShellSource = readFileSync(
  join(process.cwd(), "src/components/ui/MobileShell.tsx"),
  "utf8",
);

function goToScreen(screen: string) {
  const path = pathForScreen(screen);
  if (!path) throw new Error("Rota não mapeada: " + screen);
  window.history.pushState({}, "", path);
}

test("mantém o espaço superior original nas telas do shell", () => {
  expect(mobileShellSource).toContain('padded ? "px-5 pt-11"');
  expect(mobileShellSource).not.toContain('padded ? "px-5 pt-9"');
});

test("mantém o ícone da Apple visível no mesmo padrão cromático do Google", () => {
  expect(appleIcon).toContain('fill="#4285F4"');
  expect(appleIcon).not.toContain('fill="white"');
  expect(loginStyles).toMatch(
    /&__apple\s*{[^}]*border:\s*1px solid #b2f5ea;[^}]*background:\s*white;/s,
  );
  expect(createAccountStyles).toMatch(
    /\.is-apple\s*{[^}]*border:\s*1px solid #b2f5ea;[^}]*background:\s*white;/s,
  );
  expect(accountSettingsStyles).toMatch(
    /&__provider-icon\.is-apple\s*{[^}]*border:\s*1px solid #b2f5ea;[^}]*background:\s*white;/s,
  );
});

function expectCurrentScreen(screen: string) {
  expect(window.location.pathname).toBe(pathForScreen(screen));
}

async function enterAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/e-mail/i), "admin");
  await user.type(screen.getByLabelText(/^senha$/i), "123");
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
}

async function fillRequiredPetFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.selectOptions(screen.getByLabelText(/^sexo/i), "Macho");
  fireEvent.change(screen.getByLabelText(/data de nascimento aproximada/i), {
    target: { value: "2022-08-08" },
  });
  await user.type(screen.getByRole("textbox", { name: /^cor da pelagem/i }), "Branca");
  await user.type(screen.getByRole("textbox", { name: /^tipo da pelagem/i }), "Longa");
}

test("entra no app e abre o chatbot pelo menu inferior", async () => {
  const user = userEvent.setup();
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("button", { name: /chat/i }));
  expect(screen.getByRole("heading", { name: /conversa com balu/i })).toBeInTheDocument();
});

test("inicia o chat limpo e responde às mensagens enviadas", async () => {
  const user = userEvent.setup();
  goToScreen("14");
  render(<App />);

  expect(screen.getByText(/olá! sou o balu/i)).toBeInTheDocument();
  expect(screen.queryByText(/é o bruce/i)).not.toBeInTheDocument();

  await user.type(screen.getByLabelText("Mensagem"), "Quando é a próxima vacina?");
  await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

  expect(screen.getByText("Quando é a próxima vacina?")).toBeInTheDocument();
  expect(screen.getByText(/a carteira digital mostra as vacinas/i)).toBeInTheDocument();
});

test("lista as vacinas cadastradas ao perguntar pelo chat", async () => {
  const user = userEvent.setup();
  goToScreen("14");
  render(<App />);

  await user.type(screen.getByLabelText("Mensagem"), "Tem vacinas?");
  await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

  const reply = screen.getByText(/Vacinas de Balu/);
  expect(reply).toHaveTextContent("Antirrábica");
  expect(reply).toHaveTextContent("V10 múltipla");
});

test("mantém alerta, atalhos e envio juntos no bloco de controles do chat", () => {
  goToScreen("14");
  render(<App />);

  const controls = screen.getByRole("region", { name: "Controles da conversa" });
  const actions = within(controls).getByRole("group", { name: "Ações rápidas" });
  expect(within(actions).getAllByRole("button")).toHaveLength(2);
  expect(actions).toContainElement(screen.getByRole("button", { name: "Perguntas frequentes" }));
  expect(actions).toContainElement(screen.getByRole("button", { name: "Acionar Emergência" }));
  expect(screen.queryByRole("button", { name: "Dicas de Saúde" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Remédios" })).not.toBeInTheDocument();
  expect(controls).toContainElement(screen.getByLabelText("Mensagem"));
  expect(screen.getByLabelText("Mensagem").tagName).toBe("TEXTAREA");
});

test("mantém os controles fixos acima da navegação inferior", () => {
  expect(chatbotStyles).toMatch(
    /&__controls\s*\{[^}]*position:\s*fixed;[^}]*bottom:\s*98px;[^}]*left:\s*50%;/s,
  );
  expect(chatbotStyles).toMatch(/&__messages\s*\{[^}]*flex:\s*1;/s);
});

test("envia com Enter e cria nova linha com Control Enter", async () => {
  const user = userEvent.setup();
  goToScreen("14");
  render(<App />);
  const input = screen.getByLabelText("Mensagem");

  await user.type(input, "Primeira linha");
  await user.keyboard("{Control>}{Enter}{/Control}");
  await user.type(input, "Segunda linha");
  expect(input).toHaveValue("Primeira linha\nSegunda linha");
  expect(
    screen.queryByText("Primeira linha Segunda linha", { selector: ".is-user" }),
  ).not.toBeInTheDocument();

  await user.keyboard("{Enter}");
  expect(
    screen.getByText("Primeira linha Segunda linha", { selector: ".is-user" }),
  ).toBeInTheDocument();
  expect(input).toHaveValue("");
});

test("marca e valida os campos obrigatórios antes de entrar", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  expect(screen.getByLabelText(/^e-mail$/i)).toBeRequired();
  expect(screen.getByLabelText(/^senha$/i)).toBeRequired();
  expect(screen.getByText("* indica campo obrigatório")).toBeInTheDocument();
  expect(screen.getAllByText("*", { selector: ".login-screen__required" })).toHaveLength(2);

  await user.click(screen.getByRole("button", { name: /^entrar$/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Preencha os campos obrigatórios para continuar.",
  );
  const emailInput = screen.getByLabelText(/^e-mail$/i);
  const passwordInput = screen.getByLabelText(/^senha$/i);
  const emailError = screen.getByText("Informe o e-mail.");
  const passwordError = screen.getByText("Informe a senha.");
  expect(emailInput).toHaveAttribute("aria-invalid", "true");
  expect(emailInput).toHaveAttribute("aria-describedby", emailError.id);
  expect(passwordInput).toHaveAttribute("aria-invalid", "true");
  expect(passwordInput).toHaveAttribute("aria-describedby", passwordError.id);

  await user.type(passwordInput, "123");
  expect(screen.getByText("Informe o e-mail.")).toBeInTheDocument();
  expect(screen.queryByText("Informe a senha.")).not.toBeInTheDocument();

  await user.type(emailInput, "admin");
  expect(screen.queryByText("Informe o e-mail.")).not.toBeInTheDocument();
  expect(emailInput).toHaveAttribute("aria-invalid", "false");
  expect(passwordInput).toHaveAttribute("aria-invalid", "false");
});

test("mostra credenciais inválidas em um toast global sem pedir confirmação", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  await user.type(screen.getByLabelText(/e-mail/i), "admin");
  await user.type(screen.getByLabelText(/^senha$/i), "senha-incorreta");
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));

  expect(screen.getByRole("alert")).toHaveClass("error-feedback__toast");
  expect(screen.getByText(/coloque um e-mail e senha para entrar/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /fechar aviso/i })).toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("abre e fecha a recuperação de senha pelo login", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/login");
  render(<App />);

  const enterButton = screen.getByRole("button", { name: /^entrar$/i });
  const recoverButton = screen.getByRole("button", { name: /^esqueceu sua senha\?$/i });
  expect(recoverButton).toHaveAttribute("type", "button");
  expect(recoverButton).toHaveClass("login-screen__forgot");
  expect(enterButton.nextElementSibling).toBe(recoverButton);
  await user.click(recoverButton);

  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /^recuperar senha$/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/recuperar-senha");

  await user.click(screen.getByRole("button", { name: /^voltar$/i }));
  expect(screen.getByRole("heading", { name: /entrar no balu/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/login");
});

test("envia as instruções de recuperação no toast padrão do app", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/recuperar-senha");
  render(<App />);

  await user.type(screen.getByRole("textbox", { name: /^e-mail$/i }), "tutor@email.com");
  await user.click(screen.getByRole("button", { name: /^enviar instruções$/i }));

  const toast = screen.getByRole("alert");
  expect(toast).toHaveClass("error-feedback__toast--success");
  expect(toast).toHaveTextContent("Instruções enviadas no e-mail.");
  expect(screen.queryByText(/se este e-mail existir/i)).not.toBeInTheDocument();
  expect(window.location.pathname).toBe("/recuperar-senha");
});

test("mostra a indisponibilidade do Google em um modal", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /continuar com google/i }));

  const dialog = screen.getByRole("dialog", { name: /login indisponível/i });
  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(screen.getByText(/login com google ainda não está disponível/i)).toHaveClass(
    "error-feedback__message--single-line",
  );
  expect(screen.getByRole("button", { name: /entendi/i })).toBeInTheDocument();
});

test("mostra a indisponibilidade da Apple em um modal equivalente", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /continuar com apple/i }));

  const dialog = screen.getByRole("dialog", { name: /login indisponível/i });
  expect(dialog).toHaveTextContent(/login com apple ainda não está disponível/i);
  expect(screen.getByRole("button", { name: /entendi/i })).toBeInTheDocument();
});

test("abre as notificações ao clicar no sino da home", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);

  await user.click(screen.getByRole("button", { name: /notificações/i }));

  expect(screen.getByRole("heading", { name: /notificações/i })).toBeInTheDocument();
  expectCurrentScreen("6a");
  window.history.pushState({}, "", "/");
});

test("abre as notificações pelo sino nas variações da home", async () => {
  const user = userEvent.setup();
  goToScreen("5a");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Notificações" }));

  expect(screen.getByRole("heading", { name: "Notificações" })).toBeInTheDocument();
  expectCurrentScreen("6a");
  window.history.pushState({}, "", "/");
});

test("mantém toda a ilustração do sino como alvo de toque", () => {
  const bellRule = homeFrameStyles.match(/&__bell\s*\{([\s\S]*?)&-background/);

  expect(bellRule?.[1]).toMatch(/width:\s*48px/);
  expect(bellRule?.[1]).toMatch(/height:\s*48px/);
  expect(bellRule?.[1]).toMatch(/>\s*\*\s*\{[\s\S]*?pointer-events:\s*none/);
});

test("abre a tela de adicionar pet pelo seletor da home", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);

  await user.click(screen.getByRole("button", { name: /^adicionar$/i }));

  expect(screen.getByRole("heading", { name: /cadastrar pet/i })).toBeInTheDocument();
  expectCurrentScreen("7a");
  await user.click(screen.getByRole("button", { name: /^voltar$/i }));
  expect(screen.getByRole("button", { name: /^adicionar$/i })).toBeInTheDocument();
});

test("abre o perfil do tutor ao clicar no avatar e volta para a home", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);

  await user.click(screen.getByRole("button", { name: /abrir perfil do tutor/i }));

  expect(screen.getByRole("heading", { name: /perfil do tutor/i })).toBeInTheDocument();
  expect(screen.queryByText("Meus pets")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Abra o perfil, carteira e histórico de cada pet."),
  ).not.toBeInTheDocument();
  expectCurrentScreen("6");

  await user.click(screen.getByRole("button", { name: "Voltar" }));
  expect(screen.getByRole("heading", { name: /olá, leôncio/i })).toBeInTheDocument();
});

test("abre as configurações da conta pelo perfil e mostra a experiência atual", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("button", { name: /abrir perfil do tutor/i }));

  await user.click(screen.getAllByRole("button", { name: /configurações da conta/i })[1]);

  expect(screen.getByRole("heading", { name: /configurações da conta/i })).toBeInTheDocument();
  expect(screen.getByText("Gamificada")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /alterar experiência/i })).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Alterar e-mail" }).querySelector(".lucide-mail"),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Alterar senha" }).querySelector(".lucide-lock-keyhole"),
  ).toBeInTheDocument();
  expectCurrentScreen("6c");
});

test("abre o seletor com a experiência atual marcada e volta para as configurações", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  goToScreen("6c");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /alterar experiência/i }));

  expect(screen.getByRole("heading", { name: /escolher experiência/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /gamificada/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(screen.getByRole("button", { name: /salvar alteração/i })).toHaveClass(
    "experience-settings-screen__save",
  );
  expectCurrentScreen("6d");

  await user.click(screen.getByRole("button", { name: "Voltar" }));
  expect(screen.getByRole("heading", { name: /configurações da conta/i })).toBeInTheDocument();
});

test("abre telas próprias para alterar e-mail e senha com validação", async () => {
  const user = userEvent.setup();
  goToScreen("6c");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Alterar e-mail" }));
  expect(screen.getByRole("heading", { name: "Alterar e-mail" })).toBeInTheDocument();
  expectCurrentScreen("6e");
  await user.click(screen.getByRole("button", { name: "Salvar novo e-mail" }));
  expect(screen.getByText("Preencha todos os campos para alterar o e-mail.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Voltar" }));

  await user.click(screen.getByRole("button", { name: "Alterar senha" }));
  expect(screen.getByRole("heading", { name: "Alterar senha" })).toBeInTheDocument();
  expectCurrentScreen("6f");
  await user.click(screen.getByRole("button", { name: "Salvar nova senha" }));
  expect(screen.getByText("Preencha todos os campos para alterar a senha.")).toBeInTheDocument();
});

test("mostra e oculta cada senha de forma independente nas configurações", async () => {
  const user = userEvent.setup();
  goToScreen("6f");
  render(<App />);

  const currentPassword = screen.getByLabelText("Senha atual");
  const newPassword = screen.getByLabelText("Nova senha");
  expect(currentPassword).toHaveAttribute("type", "password");
  expect(newPassword).toHaveAttribute("type", "password");

  await user.click(screen.getAllByRole("button", { name: "Mostrar senha" })[0]);
  expect(currentPassword).toHaveAttribute("type", "text");
  expect(newPassword).toHaveAttribute("type", "password");
  expect(screen.getByRole("button", { name: "Ocultar senha" })).toBeInTheDocument();
});

test("vincula e desvincula Google e mantém Apple disponível", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  goToScreen("6c");
  render(<App />);

  expect(screen.getByRole("button", { name: "Vincular Google" })).toBeInTheDocument();
  const appleButton = screen.getByRole("button", { name: "Vincular Apple" });
  expect(appleButton).toBeInTheDocument();
  expect(
    appleButton.querySelector('img[src="/assets/figma/access/apple.svg"]'),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Vincular Google" }));
  expect(screen.getByText("Conta Google vinculada com sucesso.")).toBeInTheDocument();
  expect(localStorage.getItem("balu-google-linked")).toBe("true");

  await user.click(screen.getByRole("button", { name: "Desvincular Google" }));
  const dialog = screen.getByRole("dialog", { name: "Desvincular Google" });
  await user.click(within(dialog).getByRole("button", { name: "Desvincular" }));
  expect(localStorage.getItem("balu-google-linked")).toBe("false");
});

test("ajusta a fonte global em cinco níveis e persiste a escolha", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  goToScreen("6c");
  render(<App />);

  const slider = screen.getByRole("slider", { name: "Tamanho da fonte" });
  expect(slider).toHaveAttribute("min", "1");
  expect(slider).toHaveAttribute("max", "5");
  expect(slider).toHaveValue("3");
  await user.click(screen.getByRole("button", { name: "Aumentar fonte" }));
  expect(slider).toHaveValue("4");
  expect(localStorage.getItem("balu-font-level")).toBe("4");
  expect(document.documentElement).toHaveAttribute("data-balu-font-level", "4");
});

test("salva a experiência tradicional, abre sua home e mantém a preferência", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  goToScreen("6d");
  const firstRender = render(<App />);

  await user.click(screen.getByRole("button", { name: /tradicional/i }));
  await user.click(screen.getByRole("button", { name: /salvar alteração/i }));

  expect(localStorage.getItem("balu-experience")).toBe("traditional");
  expect(screen.getByText(/vermífugo às 14:00/i)).toBeInTheDocument();
  expect(window.location.pathname).toBe("/inicio");

  firstRender.unmount();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);
  expect(screen.getByText(/vermífugo às 14:00/i)).toBeInTheDocument();
});

test("troca da experiência tradicional para a gamificada", async () => {
  const user = userEvent.setup();
  localStorage.setItem("balu-experience", "traditional");
  goToScreen("6d");
  render(<App />);

  expect(screen.getByRole("button", { name: /tradicional/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await user.click(screen.getByRole("button", { name: /gamificada/i }));
  await user.click(screen.getByRole("button", { name: /salvar alteração/i }));

  expect(localStorage.getItem("balu-experience")).toBe("gamified");
  expect(screen.getByText(/faltam 45 xp para o nível 4/i)).toBeInTheDocument();
});

test("abre a solicitação de vínculo pela notificação da Unipet", async () => {
  const user = userEvent.setup();
  goToScreen("6a");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /abrir solicitação de vínculo da unipet/i }));

  expect(screen.getByRole("heading", { name: /unipet deseja vincular/i })).toBeInTheDocument();
  expectCurrentScreen("6b");
  window.history.pushState({}, "", "/");
});

test("volta da solicitação de vínculo para as notificações", async () => {
  const user = userEvent.setup();
  goToScreen("6b");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Voltar" }));

  expect(screen.getByRole("heading", { name: /notificações/i })).toBeInTheDocument();
  expectCurrentScreen("6a");
  window.history.pushState({}, "", "/");
});

test("abre e dispensa notificações pelo próprio cartão", async () => {
  const user = userEvent.setup();
  goToScreen("6a");
  render(<App />);

  expect(screen.queryByRole("button", { name: "Ver medicamentos" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Ver cuidadores" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Abrir rotina" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Abrir clube" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Dispensar Vermífugo Chemital vence hoje" }));
  expect(screen.queryByText("Vermífugo Chemital vence hoje")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Abrir Paulo aceitou o convite do Balu" }));
  expect(screen.getByRole("heading", { name: /cuidado compartilhado/i })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Voltar" }));
  expect(screen.getByRole("heading", { name: "Notificações" })).toBeInTheDocument();
  expectCurrentScreen("6a");
  window.history.pushState({}, "", "/");
});

test("conclui uma tarefa pela caixa de seleção", async () => {
  const user = userEvent.setup();
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getAllByText("Concluído")).toHaveLength(2);
});

test("abre uma tela numerada diretamente pela URL", () => {
  goToScreen("10");
  render(<App />);
  expect(screen.getByRole("heading", { name: /medicamentos do pet/i })).toBeInTheDocument();
});

test("mostra somente as raças seguidas na seção Minhas raças", () => {
  goToScreen("15");
  render(<App />);

  expect(screen.getByRole("button", { name: "Caramelo" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Vira-lata" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Gateiros" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /adicionar/i })).not.toBeInTheDocument();
});

test("abre o Clube dos Caramelos pelo botão Entrar no clube", async () => {
  const user = userEvent.setup();
  goToScreen("15");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Entrar no clube" }));

  expect(screen.getByRole("button", { name: "Criar publicação" })).toBeInTheDocument();
});

test("adapta o destaque e o feed para Vira-latas e Gateiros", async () => {
  const user = userEvent.setup();
  goToScreen("15");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Vira-lata" }));
  expect(screen.getByRole("heading", { name: "Clube dos Vira-latas" })).toBeInTheDocument();
  expect(screen.getByText("André Wesley")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Entrar no clube" }));
  expect(screen.getByRole("heading", { name: "Clube dos Vira-latas" })).toBeInTheDocument();
  expect(screen.getByText("André Wesley")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Voltar" }));
  await user.click(screen.getByRole("button", { name: "Gateiros" }));
  expect(screen.getByRole("heading", { name: "Clube dos Gateiros" })).toBeInTheDocument();
  expect(screen.getByText("Paulo Gabriel")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Entrar no clube" }));
  expect(screen.getByRole("heading", { name: "Clube dos Gateiros" })).toBeInTheDocument();
  expect(screen.getByText("Paulo Gabriel")).toBeInTheDocument();
});

test("busca todas as comunidades e avisa ao tentar abrir uma raça bloqueada", async () => {
  const user = userEvent.setup();
  goToScreen("15");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Ver tudo" }));
  expect(screen.getByRole("heading", { name: "Todas as comunidades" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/comunidade/todas");

  const searchInput = screen.getByRole("searchbox", { name: "Buscar comunidades" });
  await user.type(searchInput, "Poodle");
  expect(screen.getByRole("button", { name: "Comunidade Poodle bloqueada" })).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Comunidade Golden Retriever bloqueada" }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Comunidade Poodle bloqueada" }));
  expect(
    screen.getByText("Para entrar nesta comunidade, primeiro cadastre um pet da raça Poodle."),
  ).toBeInTheDocument();
});

test("mantém pronta a tela interna das novas comunidades para liberação futura", () => {
  goToScreen("16e");
  render(<App />);

  expect(screen.getByRole("heading", { name: "Clube dos Poodle" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Criar publicação" })).toBeInTheDocument();
});

test("filtra o clube por hashtag e cria uma publicação", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  const passeio = screen.getByRole("button", { name: "#Passeios" });
  await user.click(passeio);
  expect(passeio).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Passeio tranquilo no parque ao pôr do sol.")).toBeInTheDocument();
  expect(screen.queryByText(/escova de banho ajudou demais/i)).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));
  expect(within(dialog).getByText("Escreva o conteúdo da publicação.")).toBeInTheDocument();

  await user.type(
    within(dialog).getByLabelText("Conteúdo da publicação"),
    "Passeio no parque hoje.",
  );
  await user.click(within(dialog).getByRole("button", { name: "#Passeios" }));
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  expect(screen.queryByRole("dialog", { name: "Criar publicação" })).not.toBeInTheDocument();
  expect(screen.getByText("Passeio no parque hoje.")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Publicação criada com sucesso");
});

test("abre o clube sem filtro e permite desmarcar a tag ativa", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  const caramelos = screen.getByRole("button", { name: "#Caramelos" });
  const escovacao = screen.getByRole("button", { name: "#Escovação" });
  const passeios = screen.getByRole("button", { name: "#Passeios" });
  expect(caramelos).toHaveAttribute("aria-pressed", "false");
  expect(escovacao).toHaveAttribute("aria-pressed", "false");
  expect(passeios).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText(/escova de banho ajudou demais/i)).toBeInTheDocument();
  expect(screen.getByText("Passeio tranquilo no parque ao pôr do sol.")).toBeInTheDocument();

  await user.click(escovacao);
  expect(escovacao).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByText("Passeio tranquilo no parque ao pôr do sol.")).not.toBeInTheDocument();

  await user.click(escovacao);
  expect(escovacao).toHaveAttribute("aria-pressed", "false");
  expect(screen.getByText("Passeio tranquilo no parque ao pôr do sol.")).toBeInTheDocument();
});

test("curte e descurte uma publicação existente", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  const post = screen.getByText(/escova de banho ajudou demais/i).closest("article");
  expect(post).not.toBeNull();
  const likeButton = within(post as HTMLElement).getByRole("button", {
    name: "Curtir publicação",
  });

  expect(likeButton).toHaveAttribute("aria-pressed", "false");
  expect(within(post as HTMLElement).getByText("12 curtidas")).toBeInTheDocument();

  await user.click(likeButton);
  expect(likeButton).toHaveAttribute("aria-pressed", "true");
  expect(within(post as HTMLElement).getByText("13 curtidas")).toBeInTheDocument();

  await user.click(likeButton);
  expect(likeButton).toHaveAttribute("aria-pressed", "false");
  expect(within(post as HTMLElement).getByText("12 curtidas")).toBeInTheDocument();
});

test("abre a área e publica comentário identificado em uma publicação", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  const post = screen.getByText(/escova de banho ajudou demais/i).closest("article");
  expect(post).not.toBeNull();
  const commentsButton = within(post as HTMLElement).getByRole("button", {
    name: "Comentários da publicação",
  });

  expect(commentsButton).toHaveAttribute("aria-expanded", "false");
  await user.click(commentsButton);
  expect(commentsButton).toHaveAttribute("aria-expanded", "true");

  const publishedComments = within(post as HTMLElement).getByRole("list", {
    name: "Comentários publicados",
  });
  const commentField = within(post as HTMLElement).getByLabelText("Escrever comentário");
  expect(commentField).toHaveFocus();
  expect(within(publishedComments).getAllByRole("listitem")).toHaveLength(4);
  expect(within(publishedComments).getByText("Marina Freitas")).toBeInTheDocument();
  expect(within(publishedComments).getByText("MF")).toBeInTheDocument();
  expect(within(publishedComments).getByText(/escovo o pipoca todos os dias/i)).toBeInTheDocument();
  const reply = within(publishedComments).getByRole("group", {
    name: "Resposta de Salomão Rodrigues",
  });
  expect(within(reply).getByText("SR")).toBeInTheDocument();
  expect(within(reply).getByText(/obrigado pela dica/i)).toBeInTheDocument();
  const marinaLikeButton = within(publishedComments).getByRole("button", {
    name: "Curtir comentário de Marina Freitas",
  });
  expect(marinaLikeButton).toHaveAttribute("aria-pressed", "false");
  expect(marinaLikeButton).toHaveTextContent("3 curtidas");
  await user.click(marinaLikeButton);
  expect(marinaLikeButton).toHaveAttribute("aria-pressed", "true");
  expect(marinaLikeButton).toHaveTextContent("4 curtidas");
  await user.click(marinaLikeButton);
  expect(marinaLikeButton).toHaveTextContent("3 curtidas");

  await user.click(
    within(post as HTMLElement).getByRole("button", { name: "Publicar comentário" }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Escreva um comentário antes de publicar.");
  expect(commentField).toHaveFocus();

  await user.type(commentField, "A escovação diária funcionou aqui.");
  await user.click(
    within(post as HTMLElement).getByRole("button", { name: "Publicar comentário" }),
  );

  expect(within(post as HTMLElement).getByText("Leôncio Ferreira")).toBeInTheDocument();
  expect(
    within(post as HTMLElement).getByText("A escovação diária funcionou aqui."),
  ).toBeInTheDocument();
  const leoncioLikeButton = within(post as HTMLElement).getByRole("button", {
    name: "Curtir comentário de Leôncio Ferreira",
  });
  expect(within(post as HTMLElement).getByText("LF")).toBeInTheDocument();
  expect(leoncioLikeButton).toHaveTextContent("0 curtidas");
  await user.click(leoncioLikeButton);
  expect(leoncioLikeButton).toHaveTextContent("1 curtida");
  expect(commentField).toHaveValue("");
  expect(within(post as HTMLElement).getByText("5 comentários")).toBeInTheDocument();
});

test("exibe os comentários demonstrativos nos demais clubes", async () => {
  const user = userEvent.setup();
  goToScreen("16a");
  render(<App />);

  const post = screen.getAllByText(/a mel aprendeu um novo comando/i)[1].closest("article");
  expect(post).not.toBeNull();

  await user.click(
    within(post as HTMLElement).getByRole("button", {
      name: "Comentários da publicação",
    }),
  );

  const comments = within(post as HTMLElement).getByRole("list", {
    name: "Comentários publicados",
  });
  expect(within(comments).getAllByRole("listitem")).toHaveLength(4);
  expect(within(comments).getByText("Marina Freitas")).toBeInTheDocument();
  expect(
    within(comments).getByRole("group", { name: "Resposta de Salomão Rodrigues" }),
  ).toBeInTheDocument();
});

test("responde comentários em vários níveis e curte a resposta", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  const post = screen.getByText(/escova de banho ajudou demais/i).closest("article");
  expect(post).not.toBeNull();
  const postQueries = within(post as HTMLElement);
  await user.click(postQueries.getByRole("button", { name: "Comentários da publicação" }));

  await user.click(
    postQueries.getByRole("button", { name: "Responder comentário de Marina Freitas" }),
  );
  const marinaReply = postQueries.getByLabelText("Resposta para Marina Freitas");
  expect(marinaReply).toHaveFocus();
  await user.click(
    postQueries.getByRole("button", { name: "Publicar resposta para Marina Freitas" }),
  );
  expect(screen.getByRole("alert")).toHaveTextContent("Escreva uma resposta antes de publicar.");
  expect(marinaReply).toHaveFocus();
  await user.type(marinaReply, "Também vou testar essa rotina.");
  await user.click(
    postQueries.getByRole("button", { name: "Publicar resposta para Marina Freitas" }),
  );

  const newReply = postQueries
    .getByText("Também vou testar essa rotina.")
    .closest("[role='group']");
  expect(newReply).not.toBeNull();
  const newReplyQueries = within(newReply as HTMLElement);
  const likeReply = newReplyQueries.getByRole("button", {
    name: "Curtir comentário de Leôncio Ferreira",
  });
  await user.click(likeReply);
  expect(likeReply).toHaveTextContent("1 curtida");

  await user.click(
    newReplyQueries.getByRole("button", {
      name: "Responder comentário de Leôncio Ferreira",
    }),
  );
  await user.type(
    newReplyQueries.getByLabelText("Resposta para Leôncio Ferreira"),
    "Esta é uma resposta em outro nível.",
  );
  await user.click(
    newReplyQueries.getByRole("button", {
      name: "Publicar resposta para Leôncio Ferreira",
    }),
  );
  expect(newReplyQueries.getByText("Esta é uma resposta em outro nível.")).toBeInTheDocument();
});

test("seleciona várias tags ao criar uma publicação", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  const escovacao = within(dialog).getByRole("button", { name: "#Escovação" });
  const passeios = within(dialog).getByRole("button", { name: "#Passeios" });
  await user.click(escovacao);
  await user.click(passeios);
  expect(escovacao).toHaveAttribute("aria-pressed", "true");
  expect(passeios).toHaveAttribute("aria-pressed", "true");

  await user.type(
    within(dialog).getByLabelText("Conteúdo da publicação"),
    "Escovação depois do passeio.",
  );
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  await user.click(screen.getByRole("button", { name: "#Escovação" }));
  expect(screen.getByText("Escovação depois do passeio.")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "#Passeios" }));
  expect(screen.getByText("Escovação depois do passeio.")).toBeInTheDocument();
});

test("cria uma tag e a disponibiliza como filtro do clube", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  const tagField = within(dialog).getByLabelText("Criar nova tag");
  const addTag = within(dialog).getByRole("button", { name: "Adicionar tag" });

  await user.click(addTag);
  expect(screen.getByRole("alert")).toHaveTextContent("Escreva um nome para a tag.");
  expect(tagField).toHaveFocus();

  await user.type(tagField, "Banho");
  await user.click(addTag);
  expect(within(dialog).getByRole("button", { name: "#Banho" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await user.type(tagField, "#banho");
  await user.click(addTag);
  expect(screen.getByRole("alert")).toHaveTextContent("Essa tag já existe no clube.");

  await user.type(
    within(dialog).getByLabelText("Conteúdo da publicação"),
    "Hoje foi dia de banho.",
  );
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  const newFilter = screen.getByRole("button", { name: "#Banho" });
  await user.click(newFilter);
  expect(newFilter).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Hoje foi dia de banho.")).toBeInTheDocument();
});

test("permite criar uma publicação sem selecionar tags", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  const mainTag = within(dialog).getByRole("button", { name: "#Caramelos" });
  expect(mainTag).toHaveAttribute("aria-pressed", "false");

  await user.type(
    within(dialog).getByLabelText("Conteúdo da publicação"),
    "Publicação sem nenhuma tag.",
  );
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  expect(screen.getByText("Publicação sem nenhuma tag.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Sem tag" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "#Escovação" }));
  expect(screen.queryByText("Publicação sem nenhuma tag.")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "#Escovação" }));
  expect(screen.getByText("Publicação sem nenhuma tag.")).toBeInTheDocument();
});

test("adiciona opcionalmente uma imagem à publicação", async () => {
  const user = userEvent.setup();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:imagem-da-publicacao"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  goToScreen("16");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  const contentLabel = within(dialog).getByText("Conteúdo da publicação").closest("label");
  expect(contentLabel?.querySelector(".caramel-club-screen__required")).toHaveTextContent("*");
  expect(within(dialog).getByText("Imagem da publicação")).toBeInTheDocument();

  await user.upload(
    within(dialog).getByTestId("post-image-gallery-input"),
    new File(["imagem"], "passeio.png", { type: "image/png" }),
  );
  expect(
    within(dialog).getByRole("img", { name: "Prévia da imagem da publicação" }),
  ).toHaveAttribute("src", "blob:imagem-da-publicacao");

  await user.type(within(dialog).getByLabelText("Conteúdo da publicação"), "Passeio com uma foto.");
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  const post = screen.getByText("Passeio com uma foto.").closest("article");
  expect(post).not.toBeNull();
  expect(
    within(post as HTMLElement).getByRole("img", {
      name: "Imagem da publicação de Leôncio Ferreira",
    }),
  ).toHaveAttribute("src", "blob:imagem-da-publicacao");
});

test("mantém o seletor de imagem acima da navegação inferior", () => {
  expect(caramelClubStyles).toMatch(/&__backdrop\s*\{[\s\S]*?z-index:\s*30;[\s\S]*?\}/);
  expect(caramelClubStyles).toMatch(/&__image-menu-backdrop\s*\{[\s\S]*?z-index:\s*40;/);
});

test("mantém o botão de criar publicação no canto e centraliza o símbolo", () => {
  goToScreen("16");
  render(<App />);

  const addButton = screen.getByRole("button", { name: "Criar publicação" });
  expect(addButton).toHaveClass("is-cornered");
  expect(addButton.querySelector(".caramel-club-screen__add-symbol svg")).toBeInTheDocument();
});

test("permite curtir e comentar uma publicação criada na sessão", async () => {
  const user = userEvent.setup();
  goToScreen("16");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Criar publicação" }));
  const dialog = screen.getByRole("dialog", { name: "Criar publicação" });
  await user.type(
    within(dialog).getByLabelText("Conteúdo da publicação"),
    "Passeio no parque hoje.",
  );
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  const post = screen.getByText("Passeio no parque hoje.").closest("article");
  expect(post).not.toBeNull();
  const postQueries = within(post as HTMLElement);

  await user.click(postQueries.getByRole("button", { name: "Curtir publicação" }));
  expect(postQueries.getByText("1 curtida")).toBeInTheDocument();

  await user.click(postQueries.getByRole("button", { name: "Comentários da publicação" }));
  await user.type(
    postQueries.getByLabelText("Escrever comentário"),
    "Adorei compartilhar esse passeio.",
  );
  await user.click(postQueries.getByRole("button", { name: "Publicar comentário" }));

  const comments = postQueries.getByRole("region", { name: "Comentários" });
  expect(within(comments).getByText("Leôncio Ferreira")).toBeInTheDocument();
  expect(within(comments).getByText("Adorei compartilhar esse passeio.")).toBeInTheDocument();
  expect(postQueries.getByText("1 comentário")).toBeInTheDocument();
});

test("confirma o salvamento do remédio antes de voltar", async () => {
  const user = userEvent.setup();
  goToScreen("10h");
  render(<App />);

  await user.selectOptions(screen.getByLabelText("Medicamento"), "novo");
  await user.type(screen.getByPlaceholderText("Ex: Vermífugo Chemital"), "NexGard Plus");
  await user.type(screen.getByPlaceholderText("Ex: 1/2 comprimido"), "1 comprimido");
  await user.selectOptions(screen.getByLabelText("Forma"), "comprimido");
  await user.selectOptions(screen.getByLabelText("Via de administração"), "oral");
  fireEvent.change(screen.getByLabelText("Data de início"), { target: { value: "2026-08-08" } });
  await user.selectOptions(screen.getByLabelText("Frequência"), "diaria");
  fireEvent.change(screen.getByLabelText("Horário 1"), { target: { value: "14:00" } });
  await user.click(screen.getByRole("button", { name: "Salvar remédio" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Medicamento salvo com sucesso.");
  expect(screen.getByRole("heading", { name: "Adicionar remédio" })).toBeInTheDocument();
});

test("seleciona medicamento existente e adiciona vários horários", async () => {
  const user = userEvent.setup();
  goToScreen("10h");
  render(<App />);

  const medicine = screen.getByLabelText("Medicamento");
  expect(within(medicine).getByRole("option", { name: "Vermífugo Chemital" })).toBeInTheDocument();
  expect(within(medicine).getByRole("option", { name: "Prednisolona" })).toBeInTheDocument();
  expect(within(medicine).getByRole("option", { name: "Ômega 3" })).toBeInTheDocument();
  expect(within(medicine).getByRole("option", { name: "NexGard" })).toBeInTheDocument();

  await user.selectOptions(medicine, "chemital");
  expect(screen.queryByLabelText("Nome do medicamento")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Adicionar horário" }));
  expect(screen.getByLabelText("Horário 1")).toBeInTheDocument();
  expect(screen.getByLabelText("Horário 2")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Remover horário 2" }));
  expect(screen.queryByLabelText("Horário 2")).not.toBeInTheDocument();
});

test("permite desfazer um cuidado concluído", async () => {
  const user = userEvent.setup();
  goToScreen("5");
  render(<App />);

  await user.click(screen.getByRole("checkbox", { name: "Passeio Diário" }));
  await user.click(screen.getByRole("button", { name: "Desfazer" }));

  expect(screen.getByRole("checkbox", { name: "Passeio Diário" })).toHaveAttribute(
    "aria-checked",
    "false",
  );
});

test("mostra página amigável para rota desconhecida", async () => {
  const user = userEvent.setup();
  window.history.replaceState({}, "", "/rota-inexistente");
  render(<App />);

  expect(screen.getByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Voltar ao início" }));
  expect(screen.getByRole("heading", { name: "Entrar no Balu" })).toBeInTheDocument();
});

test("identifica o primeiro campo inválido do cadastro do pet", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.type(screen.getByRole("textbox", { name: /Nome do pet/ }), "Balu");
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  const breedInput = screen.getByRole("textbox", { name: /Raça/ });
  expect(breedInput).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Informe a raça do pet.")).toBeInTheDocument();
  expect(breedInput).toHaveFocus();
});

test("explica que os dados permanecem salvos ao adicionar tutor depois", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /adicionar depois/i }));
  expect(screen.getByRole("status")).toHaveTextContent("Os dados do pet serão salvos");
});

test("oferece ajuda contextual no assistente virtual", async () => {
  const user = userEvent.setup();
  goToScreen("14");
  render(<App />);

  expect(screen.getByText("Assistente Virtual (IA)")).toBeInTheDocument();
  const faqButton = screen.getByRole("button", { name: "Perguntas frequentes" });
  expect(faqButton).toHaveAttribute("aria-expanded", "false");
  expect(faqButton).toHaveAttribute("aria-controls", "chatbot-faq");

  await user.click(faqButton);

  expect(faqButton).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("region", { name: "Perguntas frequentes" })).toHaveAttribute(
    "id",
    "chatbot-faq",
  );
  expect(screen.getByText("Como registrar uma rotina?")).toBeInTheDocument();
  expect(screen.getByText("Como consultar a carteira do pet?")).toBeInTheDocument();
  expect(screen.getByText("Dicas de Saúde", { selector: "summary" })).toBeInTheDocument();

  await user.click(screen.getByText("Remédios", { selector: "summary" }));

  const medications = screen.getByRole("list", { name: "Remédios cadastrados" });
  expect(within(medications).getByText("Vermífugo Chemital")).toBeInTheDocument();
  expect(within(medications).getByText(/14:00/)).toBeInTheDocument();
  expect(within(medications).getByText("Prednisolona")).toBeInTheDocument();
  expect(within(medications).getByText(/18:30/)).toBeInTheDocument();
  expect(within(medications).getByText("Ômega 3")).toBeInTheDocument();
  expect(within(medications).getByText(/08:00/)).toBeInTheDocument();
});

test("exibe apenas o Balu na lista de pets", () => {
  goToScreen("7");
  render(<App />);

  expect(screen.getByText("Balu")).toBeInTheDocument();
  expect(screen.queryByText("Pipoca")).not.toBeInTheDocument();
  expect(screen.queryByText("Pretinha")).not.toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /ver perfil/i })).toHaveLength(1);
  expect(screen.getAllByRole("button", { name: /^consultas$/i })).toHaveLength(1);
  expect(screen.getByRole("button", { name: /adicionar novo pet/i })).toBeInTheDocument();
});

test("abre a área de consultas e inicia o agendamento pelo cartão do pet", async () => {
  const user = userEvent.setup();
  goToScreen("7");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /^consultas$/i }));

  expectCurrentScreen("7b");
  expect(screen.getByRole("heading", { name: /^consultas$/i }).closest("header")).toHaveClass(
    "pet-section-header",
  );
  const petCard = document.querySelector(".consultations-screen__pet-card");
  expect(petCard).toBeInTheDocument();
  expect(within(petCard as HTMLElement).getByRole("heading", { name: "Balu" })).toBeInTheDocument();
  expect(within(petCard as HTMLElement).getByText("Samoieda")).toBeInTheDocument();
  expect(within(petCard as HTMLElement).getByText("2 anos")).toBeInTheDocument();
  expect(within(petCard as HTMLElement).getByText("22 kg")).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /seções do perfil/i })).not.toBeInTheDocument();
  const filters = screen.getByRole("group", { name: /filtrar histórico de consultas/i });
  const nextConsultation = screen.getByText(/próxima consulta/i);
  expect(petCard?.compareDocumentPosition(filters)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(filters.compareDocumentPosition(nextConsultation)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  expect(screen.getByText(/leve os resultados do exame de pele/i)).toBeInTheDocument();
  expect(screen.getByText(/^cancelada$/i)).toBeInTheDocument();

  const details = screen.getByRole("link", { name: /ver detalhes/i });
  await user.click(details);
  const detailsDialog = screen.getByRole("dialog", { name: /detalhes da consulta/i });
  expect(within(detailsDialog).getByText("Balu")).toBeInTheDocument();
  expect(within(detailsDialog).getByText("Retorno dermatológico")).toBeInTheDocument();
  expect(within(detailsDialog).getByText(/clínica vetcare/i)).toBeInTheDocument();
  expect(within(detailsDialog).getByText(/dra\. mariana/i)).toBeInTheDocument();
  expect(
    within(detailsDialog).queryByRole("button", { name: /confirmar presença/i }),
  ).not.toBeInTheDocument();
  expect(
    within(detailsDialog).queryByRole("button", { name: /cancelar consulta/i }),
  ).not.toBeInTheDocument();
  await user.click(within(detailsDialog).getByRole("button", { name: /^fechar$/i }));
  await vi.waitFor(() => expect(details).toHaveFocus());

  const schedule = screen.getByRole("button", { name: /marcar consulta/i });
  await user.click(schedule);

  expect(screen.getByRole("dialog", { name: /marcar consulta/i })).toBeInTheDocument();
  expect(screen.getByText("Agendamento para Balu")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /fechar agendamento/i }));
  await vi.waitFor(() => expect(schedule).toHaveFocus());
});

test("filtra o histórico de consultas por situação", async () => {
  const user = userEvent.setup();
  goToScreen("7b");
  render(<App />);

  const allFilter = screen.getByRole("button", { name: "Todas" });
  const completedFilter = screen.getByRole("button", { name: "Concluídas" });
  const cancelledFilter = screen.getByRole("button", { name: "Canceladas" });
  expect(allFilter).toHaveAttribute("aria-pressed", "true");
  await user.click(completedFilter);
  expect(allFilter).toHaveAttribute("aria-pressed", "false");
  expect(completedFilter).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText("Consulta preventiva anual")).toBeInTheDocument();
  expect(screen.queryByText("Consulta odontológica")).not.toBeInTheDocument();

  await user.click(cancelledFilter);
  expect(completedFilter).toHaveAttribute("aria-pressed", "false");
  expect(cancelledFilter).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByText("Consulta preventiva anual")).not.toBeInTheDocument();
  expect(screen.getByText("Consulta odontológica")).toBeInTheDocument();
});

test("confirma a presença na próxima consulta do pet", async () => {
  const user = userEvent.setup();
  goToScreen("7b");
  render(<App />);

  const nextCard = screen.getByRole("region", { name: /retorno dermatológico/i });
  const details = within(nextCard).getByRole("link", { name: /ver detalhes/i });
  const confirm = within(nextCard).getByRole("button", { name: /^confirmar$/i });
  expect(details.compareDocumentPosition(confirm)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  await user.click(confirm);

  expect(screen.queryByRole("dialog", { name: /detalhes da consulta/i })).not.toBeInTheDocument();
  expect(screen.getByText("Presença confirmada")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Presença do Balu confirmada.");
});

test("reagenda a próxima consulta do pet", async () => {
  const user = userEvent.setup();
  goToScreen("7b");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Reagendar consulta" }));
  const dialog = screen.getByRole("dialog", { name: "Reagendar consulta" });
  await user.click(within(dialog).getByRole("button", { name: "20 de agosto de 2026" }));
  await user.click(within(dialog).getByRole("button", { name: "09:30" }));
  await user.click(within(dialog).getByRole("button", { name: "Confirmar consulta" }));
  await user.click(within(dialog).getByRole("button", { name: "Concluir" }));

  expect(screen.getByText("20 de agosto, às 09:30")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Consulta do Balu reagendada.");
});

test("exige um motivo para cancelar a próxima consulta do pet", async () => {
  const user = userEvent.setup();
  goToScreen("7b");
  render(<App />);

  const nextCard = screen.getByRole("region", { name: /retorno dermatológico/i });
  await user.click(within(nextCard).getByRole("button", { name: /^cancelar$/i }));
  const reason = screen.getByRole("textbox", { name: /motivo do cancelamento/i });
  await user.click(screen.getByRole("button", { name: /confirmar cancelamento/i }));

  expect(reason).toHaveAttribute("aria-invalid", "true");
  expect(reason).toHaveAccessibleDescription("Informe o motivo do cancelamento.");
  expect(screen.getByRole("alert")).toHaveTextContent("Informe o motivo do cancelamento.");

  await user.type(reason, "Balu estará em viagem");
  await user.click(screen.getByRole("button", { name: /confirmar cancelamento/i }));

  expect(screen.queryByText("Próxima consulta")).not.toBeInTheDocument();
  expect(screen.getByText("Balu estará em viagem")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Consulta do Balu cancelada.");
});

test("usa o foco verde do app no motivo do cancelamento sem contorno preto", () => {
  expect(consultationStyles).toMatch(/textarea:focus-visible\s*\{[^}]*outline:\s*0;/s);
  expect(consultationStyles).toMatch(/textarea:focus-visible\s*\{[^}]*border-color:\s*#2dd4bf;/s);
});

test("volta da tela de consultas para meus pets", async () => {
  const user = userEvent.setup();
  goToScreen("7b");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /^voltar$/i }));

  expect(screen.getByRole("heading", { name: /meus pets/i })).toBeInTheDocument();
});

test("usa o mesmo formulário nas rotas de cadastro e adicionar pet", () => {
  const fields = [
    /nome do pet/i,
    /raça/i,
    /^sexo/i,
    /data de nascimento aproximada/i,
    /cor da pelagem/i,
    /tipo da pelagem/i,
  ];

  goToScreen("3");
  const onboarding = render(<App />);
  for (const field of fields) expect(screen.getByLabelText(field)).toBeRequired();
  expect(screen.getByRole("button", { name: /adicionar foto do pet/i })).toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: /ações de cuidado compartilhado/i }),
  ).toBeInTheDocument();
  onboarding.unmount();

  goToScreen("7a");
  render(<App />);

  expect(screen.getByRole("heading", { name: /cadastrar pet/i })).toBeInTheDocument();
  for (const field of fields) expect(screen.getByLabelText(field)).toBeRequired();
  expect(screen.getByRole("button", { name: /adicionar foto do pet/i })).toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: /ações de cuidado compartilhado/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText(/etapa 2 de 3/i)).not.toBeInTheDocument();
  expect(screen.queryByText("🐾")).not.toBeInTheDocument();
});

test("volta para meus pets ao abrir a rota de adicionar pet diretamente", async () => {
  const user = userEvent.setup();
  goToScreen("7a");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /^voltar$/i }));

  expect(screen.getByRole("heading", { name: /meus pets/i })).toBeInTheDocument();
});

test("mantém as ações de cuidado compartilhado juntas no cadastro do pet", () => {
  goToScreen("3");
  render(<App />);

  const actions = screen.getByRole("group", { name: /ações de cuidado compartilhado/i });
  expect(actions).toContainElement(screen.getByRole("button", { name: /convidar tutor/i }));
  expect(actions).toContainElement(screen.getByRole("button", { name: /adicionar depois/i }));
  expect(registerPetStyles).toMatch(
    /&-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/,
  );
  expect(registerPetStyles).toMatch(/&__action\s*\{[\s\S]*?min-height:\s*72px/);
});

test("cadastro do pet identifica todos os campos obrigatórios", () => {
  goToScreen("3");
  render(<App />);

  expect(screen.getByText("* indica campo obrigatório")).toBeInTheDocument();
  expect(screen.getAllByText("*", { selector: ".required-mark" })).toHaveLength(6);
  expect(screen.getByLabelText(/nome do pet/i)).toBeRequired();
  expect(screen.getByLabelText(/raça/i)).toBeRequired();
  expect(screen.getByLabelText(/sexo/i)).toBeRequired();
  expect(screen.getByLabelText(/data de nascimento aproximada/i)).toBeRequired();
  expect(screen.getByRole("textbox", { name: /^cor da pelagem/i })).toBeRequired();
  expect(screen.getByRole("textbox", { name: /^tipo da pelagem/i })).toBeRequired();
  expect(screen.queryByLabelText(/idade/i)).not.toBeInTheDocument();
});

test("cadastro do pet oferece sexo, nascimento aproximado e pelagem obrigatórios", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const sex = screen.getByRole("combobox", { name: /^sexo/i });
  expect(within(sex).getAllByRole("option")).toHaveLength(3);
  expect(within(sex).getByRole("option", { name: "Macho" })).toBeInTheDocument();
  expect(within(sex).getByRole("option", { name: "Fêmea" })).toBeInTheDocument();
  expect(within(sex).queryByRole("option", { name: /não sei/i })).not.toBeInTheDocument();

  const birthDate = screen.getByLabelText(/data de nascimento aproximada/i);
  const coatColor = screen.getByRole("textbox", { name: /^cor da pelagem/i });
  const coatType = screen.getByRole("textbox", { name: /^tipo da pelagem/i });
  expect(birthDate).toHaveAttribute("type", "date");
  expect(birthDate).toHaveAttribute("max", expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
  expect(coatColor).not.toHaveAttribute("list");
  expect(coatType).not.toHaveAttribute("list");

  fireEvent.change(birthDate, { target: { value: "2020-05-10" } });
  await user.type(coatColor, "Dourada com manchas");
  await user.type(coatType, "Dupla e volumosa");
  expect(birthDate).toHaveValue("2020-05-10");
  expect(coatColor).toHaveValue("Dourada com manchas");
  expect(coatType).toHaveValue("Dupla e volumosa");
  expect(screen.queryByRole("checkbox", { name: /não sei/i })).not.toBeInTheDocument();
});

test("cadastro do pet associa as mensagens aos seis campos obrigatórios", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /^continuar$/i }));

  const cases = [
    [screen.getByLabelText(/nome do pet/i), "Informe o nome do pet."],
    [screen.getByLabelText(/raça/i), "Informe a raça do pet."],
    [screen.getByRole("combobox", { name: /^sexo/i }), "Informe o sexo do pet."],
    [
      screen.getByLabelText(/data de nascimento aproximada/i),
      "Informe a data de nascimento aproximada.",
    ],
    [screen.getByRole("textbox", { name: /^cor da pelagem/i }), "Informe a cor da pelagem."],
    [screen.getByRole("textbox", { name: /^tipo da pelagem/i }), "Informe o tipo da pelagem."],
  ] as const;

  for (const [control, message] of cases) {
    const error = screen.getByText(message);
    expect(control).toHaveAttribute("aria-invalid", "true");
    expect(control).toHaveAttribute("aria-describedby", error.id);
  }
});

test("cadastro do pet mantém controles adequados ao canvas mobile", () => {
  goToScreen("3");
  render(<App />);

  const sex = screen.getByRole("combobox", { name: /^sexo/i });
  expect(document.querySelector(".register-pet-screen__canvas")).toBeInTheDocument();
  expect(sex).toBeInTheDocument();
  expect(screen.queryByRole("checkbox", { name: /não sei/i })).not.toBeInTheDocument();
  expect(registerPetStyles).toMatch(/&__canvas\s*\{[\s\S]*?max-width:\s*393px/);
  expect(registerPetStyles).toMatch(
    /input:not\(\[type="checkbox"\]\),\s*select\s*\{[\s\S]*?height:\s*48px/,
  );
});

test("cadastro do pet rejeita nascimento futuro e limpa somente o erro corrigido", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.selectOptions(screen.getByLabelText(/^sexo/i), "Macho");
  fireEvent.change(screen.getByLabelText(/data de nascimento aproximada/i), {
    target: { value: "2999-01-01" },
  });
  await user.click(screen.getByRole("button", { name: /^continuar$/i }));

  const birthDate = screen.getByLabelText(/data de nascimento aproximada/i);
  const birthError = screen.getByText("A data de nascimento não pode estar no futuro.");
  expect(birthDate).toHaveAttribute("aria-invalid", "true");
  expect(birthDate).toHaveAttribute("aria-describedby", birthError.id);
  expect(birthDate).toHaveFocus();
  expect(screen.getByText("Informe a cor da pelagem.")).toBeInTheDocument();

  fireEvent.change(birthDate, { target: { value: "2022-08-08" } });
  expect(
    screen.queryByText("A data de nascimento não pode estar no futuro."),
  ).not.toBeInTheDocument();
  expect(screen.getByText("Informe a cor da pelagem.")).toBeInTheDocument();
});

test("cadastro do pet aceita a data local atual", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.selectOptions(screen.getByLabelText(/^sexo/i), "Macho");
  const birthDate = screen.getByLabelText(/data de nascimento aproximada/i);
  fireEvent.change(birthDate, { target: { value: birthDate.getAttribute("max") } });
  await user.type(screen.getByRole("textbox", { name: /^cor da pelagem/i }), "Branca");
  await user.type(screen.getByRole("textbox", { name: /^tipo da pelagem/i }), "Curta");
  await user.click(screen.getByRole("button", { name: /adicionar depois/i }));
  await user.click(screen.getByRole("button", { name: /^continuar$/i }));

  expectCurrentScreen("4");
});

test("cadastro do pet mostra o erro global quando os dados estão vazios", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /continuar/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Preencha os campos obrigatórios para continuar.",
  );
  expect(screen.getByRole("heading", { name: /cadastrar pet/i })).toBeInTheDocument();
});

test("cadastro do pet exige uma escolha de cuidado compartilhado", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await fillRequiredPetFields(user);
  await user.click(screen.getByRole("button", { name: /continuar/i }));

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Selecione uma opção no cuidado compartilhado.",
  );
  expectCurrentScreen("3");
});

test("cadastro do pet permite selecionar adicionar depois e continuar", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const addLater = screen.getByRole("button", { name: /adicionar depois/i });
  await user.click(addLater);
  expect(addLater).toHaveAttribute("aria-pressed", "true");

  await fillRequiredPetFields(user);
  await user.click(screen.getByRole("button", { name: /continuar/i }));

  expect(screen.getByRole("heading", { name: /escolha sua experiência/i })).toBeInTheDocument();
  expectCurrentScreen("4");
});

test("cadastro do pet apresenta ações claras e seleciona adicionar depois", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const invite = screen.getByRole("button", { name: /convidar tutor/i });
  const addLater = screen.getByRole("button", { name: /adicionar depois/i });
  const familyCode = screen.getByRole("button", { name: /entrar com código/i });
  expect(invite).toHaveTextContent(/gere um código para compartilhar/i);
  expect(addLater).toHaveTextContent(/continue agora e convide alguém/i);
  expect(familyCode).toHaveTextContent(/família já existente/i);

  await user.click(addLater);
  expect(addLater).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText(/os dados do pet serão salvos/i)).toBeInTheDocument();
});

test("cadastro do pet valida e conclui a entrada com código da família", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const addLater = screen.getByRole("button", { name: /adicionar depois/i });
  const familyCode = screen.getByRole("button", { name: /entrar com código/i });
  await user.click(addLater);
  await user.click(familyCode);

  const codeInput = screen.getByRole("textbox", { name: /código da família/i });
  expect(familyCode).toHaveAttribute("aria-pressed", "false");
  expect(addLater).toHaveAttribute("aria-pressed", "true");

  await user.click(screen.getByRole("button", { name: /vincular família/i }));
  expect(codeInput).toHaveAttribute("aria-invalid", "true");
  const emptyCodeError = screen.getByText("Informe o código da família.");
  expect(codeInput).toHaveAttribute("aria-describedby", emptyCodeError.id);
  expect(codeInput).toHaveFocus();

  await user.type(codeInput, "incorreto");
  expect(codeInput).toHaveValue("INCORRETO");
  await user.click(screen.getByRole("button", { name: /vincular família/i }));
  expect(screen.getByText("Código da família inválido.")).toBeInTheDocument();

  await user.clear(codeInput);
  await user.type(codeInput, "balu-4821");
  await user.click(screen.getByRole("button", { name: /vincular família/i }));

  expect(screen.queryByRole("textbox", { name: /código da família/i })).not.toBeInTheDocument();
  expect(addLater).toHaveAttribute("aria-pressed", "false");
  expect(familyCode).toHaveAttribute("aria-pressed", "true");

  await fillRequiredPetFields(user);
  await user.click(screen.getByRole("button", { name: /^continuar$/i }));
  expectCurrentScreen("4");
});

test("cadastro do pet conclui o convite ao copiar sem perder os dados", async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:foto-onboarding"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  goToScreen("3");
  render(<App />);

  const nameInput = screen.getByLabelText(/nome do pet/i);
  await user.type(nameInput, "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.selectOptions(screen.getByLabelText(/^sexo/i), "Macho");
  fireEvent.change(screen.getByLabelText(/data de nascimento aproximada/i), {
    target: { value: "2022-08-08" },
  });
  await user.type(screen.getByRole("textbox", { name: /^cor da pelagem/i }), "Branca");
  await user.type(screen.getByRole("textbox", { name: /^tipo da pelagem/i }), "Longa");
  await user.upload(
    screen.getByTestId("pet-photo-gallery-input"),
    new File(["foto"], "balu.png", { type: "image/png" }),
  );
  const invite = screen.getByRole("button", { name: /convidar tutor/i });
  await user.click(invite);

  const dialog = screen.getByRole("dialog", { name: /convidar tutor/i });
  expect(dialog).toHaveAccessibleDescription("Compartilhe este código com outro cuidador.");
  expect(dialog.querySelector(".register-pet-screen__invite-icon")).toBeInTheDocument();
  const codeCard = dialog.querySelector(".register-pet-screen__invite-code-card");
  expect(codeCard).toHaveTextContent("Código do convite");
  expect(dialog).toHaveTextContent("BALU-4821");
  expect(dialog).not.toHaveTextContent("Permissões do convite");
  expect(dialog).not.toHaveTextContent("Ver rotina e histórico do pet");
  expect(within(dialog).queryByRole("list")).not.toBeInTheDocument();
  expect(
    within(dialog).queryByRole("button", { name: /concluir convite/i }),
  ).not.toBeInTheDocument();
  expect(within(dialog).queryByRole("button", { name: /^cancelar$/i })).not.toBeInTheDocument();
  const whatsappLink = screen.getByRole("link", { name: /enviar no whatsapp/i });
  expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("wa.me"));
  expect(whatsappLink).toHaveClass("register-pet-screen__whatsapp");
  expect(whatsappLink.querySelector("img")).toHaveAttribute(
    "src",
    "/assets/figma/pets/whatsapp.svg",
  );
  const closeInvite = screen.getByRole("button", { name: /fechar convite/i });
  expect(closeInvite).toHaveFocus();
  const whatsapp = screen.getByRole("link", { name: /enviar no whatsapp/i });
  await user.tab({ shift: true });
  expect(whatsapp).toHaveFocus();
  await user.tab();
  expect(closeInvite).toHaveFocus();
  const copyButton = screen.getByRole("button", { name: /copiar código/i });

  await user.click(copyButton);
  expect(writeText).toHaveBeenCalledWith("BALU-4821");
  expect(screen.queryByRole("dialog", { name: /convidar tutor/i })).not.toBeInTheDocument();
  expect(invite).toHaveAttribute("aria-pressed", "true");
  expect(invite).toHaveFocus();
  expect(nameInput).toHaveValue("Balu");
  expect(screen.getByLabelText(/raça/i)).toHaveValue("Samoieda");
  expect(screen.getByLabelText(/sexo/i)).toHaveValue("Macho");
  expect(screen.getByLabelText(/data de nascimento aproximada/i)).toHaveValue("2022-08-08");
  expect(screen.getByRole("textbox", { name: /^cor da pelagem/i })).toHaveValue("Branca");
  expect(screen.getByRole("textbox", { name: /^tipo da pelagem/i })).toHaveValue("Longa");
  expect(screen.getByRole("img", { name: /foto selecionada do pet/i })).toHaveAttribute(
    "src",
    "blob:foto-onboarding",
  );
  await user.click(screen.getByRole("button", { name: /^continuar$/i }));
  expectCurrentScreen("4");
});

test("cadastro do pet fecha convite e código sem substituir a escolha anterior", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const addLater = screen.getByRole("button", { name: /adicionar depois/i });
  const invite = screen.getByRole("button", { name: /convidar tutor/i });
  const familyCode = screen.getByRole("button", { name: /entrar com código/i });
  await user.click(addLater);

  await user.click(invite);
  await user.keyboard("{Escape}");
  expect(addLater).toHaveAttribute("aria-pressed", "true");
  expect(invite).toHaveFocus();

  await user.click(invite);
  const dialog = screen.getByRole("dialog", { name: /convidar tutor/i });
  fireEvent.pointerDown(dialog.parentElement!);
  expect(screen.queryByRole("dialog", { name: /convidar tutor/i })).not.toBeInTheDocument();
  expect(addLater).toHaveAttribute("aria-pressed", "true");
  expect(invite).toHaveFocus();

  await user.click(invite);
  await user.click(screen.getByRole("button", { name: /fechar convite/i }));
  expect(addLater).toHaveAttribute("aria-pressed", "true");

  await user.click(familyCode);
  await user.click(screen.getByRole("button", { name: /^cancelar$/i }));
  expect(addLater).toHaveAttribute("aria-pressed", "true");
  expect(screen.queryByRole("textbox", { name: /código da família/i })).not.toBeInTheDocument();
});

test("cadastro do pet conclui o convite ao abrir o WhatsApp", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const invite = screen.getByRole("button", { name: /convidar tutor/i });
  await user.click(invite);
  await user.click(screen.getByRole("link", { name: /enviar no whatsapp/i }));

  expect(screen.queryByRole("dialog", { name: /convidar tutor/i })).not.toBeInTheDocument();
  expect(invite).toHaveAttribute("aria-pressed", "true");
  expect(invite).toHaveFocus();
});

test("exibe o perfil do pet com os atalhos do frame 8 sem marcador emoji", () => {
  goToScreen("8");
  render(<App />);

  expect(screen.getByRole("heading", { name: /perfil do pet/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /abrir rotina/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /abrir remédios/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /abrir carteira de saúde/i })).toBeInTheDocument();
  expect(screen.queryByText("🐾")).not.toBeInTheDocument();
});

test("mantém as telas restantes de pets livres de placeholders emoji", () => {
  for (const tela of ["9", "10", "11", "13"]) {
    goToScreen(tela);
    const { unmount } = render(<App />);
    expect(screen.queryByText("🐾")).not.toBeInTheDocument();
    expect(screen.queryByText("👤")).not.toBeInTheDocument();
    unmount();
  }
});

test("separa informações diferentes em linhas próprias dentro das caixas", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  const home = render(<App />);
  await enterAsAdmin(user);
  expect(screen.getByText("Ração Seca Premier")).toBeInTheDocument();
  expect(screen.getByText("Feito por Leôncio")).toBeInTheDocument();
  home.unmount();

  const checks = [
    ["7", "Samoieda", "2 anos"],
    ["9a", "Alimentação às 08:00", "Vermífugo às 14:00"],
    ["10a", "NexGard", "1 comprimido após a refeição"],
    ["11", "Aplicada em 12/06/2026", "Próximo reforço em 2027."],
    ["12", "Paulo", "Deu Vermífugo Chemital"],
  ] as const;

  for (const [route, main, secondary] of checks) {
    goToScreen(route);
    const rendered = render(<App />);
    expect(screen.getAllByText(main).length).toBeGreaterThan(0);
    expect(screen.getByText(secondary)).toBeInTheDocument();
    rendered.unmount();
  }
});

test("abre as telas de adicionar rotina e remédio pelos botões", async () => {
  const user = userEvent.setup();

  for (const route of ["9", "9a", "9b", "9c"]) {
    goToScreen(route);
    const routine = render(<App />);
    await user.click(screen.getByRole("button", { name: "Cadastrar nova rotina" }));
    expect(screen.getByRole("heading", { name: "Adicionar rotina" })).toBeInTheDocument();
    routine.unmount();
  }

  goToScreen("10");
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Adicionar remédio" }));
  expect(screen.getByRole("heading", { name: "Adicionar remédio" })).toBeInTheDocument();
});

test("valida e salva uma nova rotina com campos progressivos", async () => {
  const user = userEvent.setup();
  goToScreen("9e");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Salvar rotina" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Preencha os campos obrigatórios da rotina.");
  expect(screen.getByText("Selecione o tipo de cuidado.")).toBeInTheDocument();
  expect(screen.getByText("Informe o nome da rotina.")).toBeInTheDocument();
  expect(screen.getByText("Selecione a frequência.")).toBeInTheDocument();
  expect(screen.getByText("Informe todos os horários no formato 24 horas.")).toBeInTheDocument();
  expect(screen.getByLabelText("Tipo de cuidado")).toHaveFocus();

  await user.selectOptions(screen.getByLabelText("Tipo de cuidado"), "passeio");
  await user.type(screen.getByLabelText("Nome da rotina"), "Passeio da tarde");
  await user.selectOptions(screen.getByLabelText("Frequência"), "semanal");

  expect(screen.getByRole("group", { name: "Dias da semana" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Salvar rotina" }));
  expect(screen.getByText("Selecione ao menos um dia da semana.")).toBeInTheDocument();

  await user.click(screen.getByLabelText("Segunda-feira"));
  fireEvent.change(screen.getByLabelText("Horário 1"), { target: { value: "18:00" } });
  await user.selectOptions(screen.getByLabelText("Lembrete"), "10");
  await user.click(screen.getByRole("button", { name: "Salvar rotina" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Rotina salva com sucesso.");
});

test("vincula uma rotina de medicamento cadastrado e permite vários horários", async () => {
  const user = userEvent.setup();
  goToScreen("9e");
  render(<App />);

  await user.selectOptions(screen.getByLabelText("Tipo de cuidado"), "medicamento");
  const medicine = screen.getByLabelText("Medicamento cadastrado");
  expect(within(medicine).getByRole("option", { name: "Vermífugo Chemital" })).toBeInTheDocument();
  expect(within(medicine).getByRole("option", { name: "Prednisolona" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Adicionar horário" }));
  expect(screen.getByLabelText("Horário 1")).toBeInTheDocument();
  expect(screen.getByLabelText("Horário 2")).toBeInTheDocument();
});

test("usa horários de 24 horas e não exibe a marca opcional nos formulários", () => {
  for (const route of ["9e", "10h"]) {
    goToScreen(route);
    const rendered = render(<App />);
    const time = screen.getByLabelText("Horário 1");

    expect(time).toHaveAttribute("type", "text");
    expect(time).toHaveAttribute("inputmode", "numeric");
    expect(time).toHaveAttribute("placeholder", "HH:MM");
    expect(screen.queryByText("Opcional")).not.toBeInTheDocument();
    rendered.unmount();
  }
});

test("mostra o aviso de campos obrigatórios no início das telas de adicionar", () => {
  for (const route of ["7a", "9e", "10h"]) {
    goToScreen(route);
    const rendered = render(<App />);
    const notice = screen.getByText("* indica campo obrigatório");
    expect(notice).toHaveClass("required-note");
    rendered.unmount();
  }
});

test("reproduz os conteúdos-chave dos frames restantes de pets", () => {
  const expectations = [
    ["6b", /aceitar vínculo/i],
    ["9", /visão geral/i],
    ["10", /prednisolona/i],
    ["11", /próxima dose em 25\/07\/2026/i],
    ["12", /clínica sincronizou vacina v10 múltipla/i],
    ["13", /balu-4821/i],
  ] as const;

  for (const [tela, content] of expectations) {
    goToScreen(tela);
    const { unmount } = render(<App />);
    expect(screen.getByText(content)).toBeInTheDocument();
    unmount();
  }
});

test("não exibe a ação externa na carteira de vacinação", () => {
  goToScreen("11");
  render(<App />);

  expect(
    screen.queryByRole("button", { name: /abrir carteira pet do gov/i }),
  ).not.toBeInTheDocument();
});

test("mantém a navegação inferior nos frames de pets que a exibem", () => {
  for (const tela of ["9", "10", "11", "12"]) {
    goToScreen(tela);
    const { unmount } = render(<App />);
    expect(screen.getByRole("button", { name: "Pets" })).toBeInTheDocument();
    unmount();
  }
});

test("navega pela barra inferior ao abrir diretamente uma tela numerada", async () => {
  const user = userEvent.setup();
  goToScreen("10");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Início" }));

  expect(screen.getByRole("heading", { name: /olá, leôncio/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/inicio");
});

test("as setas voltam para a tela interna correta mesmo em URLs diretas", async () => {
  const user = userEvent.setup();
  const returns = [
    ["6", /olá, leôncio/i],
    ["6c", /perfil do tutor/i],
    ["6d", /configurações da conta/i],
    ["6a", /olá, leôncio/i],
    ["6b", /notificações/i],
    ["7a", /meus pets/i],
    ["8", /meus pets/i],
    ["9", /perfil do pet/i],
    ["10", /perfil do pet/i],
    ["11", /perfil do pet/i],
    ["12", /perfil do pet/i],
    ["13", /cuidado compartilhado/i],
    ["14", /olá, leôncio/i],
    ["16", /comunidades/i],
  ] as const;

  for (const [tela, destinationHeading] of returns) {
    goToScreen(tela);
    const rendered = render(<App />);

    await user.click(screen.getByRole("button", { name: "Voltar" }));

    expect(screen.getByRole("heading", { name: destinationHeading })).toBeInTheDocument();
    rendered.unmount();
  }
});

test("exibe os registros exatos dos frames de remédios e carteira", () => {
  goToScreen("10");
  const medicines = render(<App />);
  expect(screen.getByText(/08:00 • ômega 3/i)).toBeInTheDocument();
  medicines.unmount();

  goToScreen("11");
  render(<App />);
  expect(screen.getByText(/v10 múltipla/i)).toBeInTheDocument();
  expect(screen.queryByText(/carteira sincronizada/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/vacinação em dia/i)).not.toBeInTheDocument();
});

test("remove Docs da carteira e permite consultar o laudo de um exame", async () => {
  const user = userEvent.setup();
  goToScreen("11");
  render(<App />);

  expect(screen.queryByRole("button", { name: "Docs" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Exames" }));
  await user.click(screen.getByRole("button", { name: "Abrir exame Hemograma Completo" }));

  const details = screen.getByRole("dialog", { name: "Detalhes do exame" });
  expect(details).toHaveTextContent("Resultados dentro dos padrões de normalidade.");
  await user.click(within(details).getByRole("button", { name: "Visualizar laudo" }));
  expect(screen.getByRole("dialog", { name: "Laudo do Hemograma Completo" })).toHaveTextContent(
    "Laudo demonstrativo",
  );
});

test("abre detalhes de todos os registros da carteira", async () => {
  const user = userEvent.setup();
  goToScreen("11");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Ver detalhes de Antirrábica" }));
  expect(screen.getByRole("dialog", { name: "Detalhes da vacina Antirrábica" })).toHaveTextContent(
    "não substitui o registro oficial",
  );
  await user.click(screen.getByRole("button", { name: "Fechar" }));

  await user.click(screen.getByRole("button", { name: "Ver detalhes de V10 múltipla" }));
  expect(screen.getByRole("dialog", { name: "Detalhes da vacina V10 múltipla" })).toHaveTextContent(
    "25/07/2026",
  );
  await user.click(screen.getByRole("button", { name: "Fechar" }));

  await user.click(screen.getByRole("button", { name: "Consultas" }));
  await user.click(
    screen.getByRole("button", { name: "Ver detalhes da Consulta Preventiva Anual" }),
  );
  expect(screen.getByRole("dialog", { name: "Detalhes da consulta" })).toHaveTextContent(
    "Dra. Mariana",
  );
});

test("atualiza a foto do Balu e mantém a imagem entre telas", async () => {
  const user = userEvent.setup();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:nova-foto-balu"),
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
  goToScreen("11");
  render(<App />);

  await user.upload(
    screen.getByTestId("shared-pet-photo-gallery-input"),
    new File(["foto"], "balu.png", { type: "image/png" }),
  );
  expect(screen.getByRole("img", { name: "Foto do Balu" })).toHaveAttribute(
    "src",
    "blob:nova-foto-balu",
  );
  await user.click(screen.getByRole("button", { name: "Visão geral" }));
  expect(screen.getByRole("img", { name: "Foto do Balu" })).toHaveAttribute(
    "src",
    "blob:nova-foto-balu",
  );
});

test("edita e remove o pet da lista preservando o prontuário", async () => {
  const user = userEvent.setup();
  goToScreen("7");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Editar pet Balu" }));
  expect(screen.getByRole("heading", { name: "Editar pet" })).toBeInTheDocument();
  const name = screen.getByLabelText("Nome do pet");
  expect(name).toHaveValue("Balu");
  await user.clear(name);
  await user.type(name, "Balu Flores");
  await user.click(screen.getByRole("button", { name: "Salvar alterações" }));
  expect(screen.getByText("Balu Flores")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Excluir pet Balu Flores" }));
  const dialog = screen.getByRole("dialog", { name: "Remover pet da lista" });
  expect(dialog).toHaveTextContent("prontuário clínico será preservado");
  await user.click(within(dialog).getByRole("button", { name: "Confirmar remoção" }));
  expect(screen.queryByText("Balu Flores")).not.toBeInTheDocument();
  expect(screen.getByText("Nenhum pet na sua lista.")).toBeInTheDocument();
});

test("navega pelas telas 10A, 10B e 10C e conclui medicamentos pelas caixas", async () => {
  const user = userEvent.setup();
  goToScreen("10");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Próximos" }));
  expectCurrentScreen("10a");
  expect(screen.getByText(/amanhã • 08:00/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Hoje" }));
  expectCurrentScreen("10b");
  expect(screen.getByText(/hoje • 08:00/i)).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Histórico" }));
  expectCurrentScreen("10c");
  expect(screen.getByText(/12 de julho • 08:00/i)).toBeInTheDocument();
  expect(screen.getByText("Ômega 3")).toBeInTheDocument();
  expect(screen.getAllByText("Confirmado por Leôncio")).toHaveLength(3);

  const detailRoutes = [
    ["10d", /ômega 3/i],
    ["10e", /prednisolona/i],
    ["10f", /vermífugo/i],
  ] as const;
  for (let index = 0; index < detailRoutes.length; index += 1) {
    await user.click(screen.getAllByRole("button", { name: "Ver detalhes" })[index]);
    expectCurrentScreen(detailRoutes[index][0]);
    expect(screen.getByRole("heading", { name: /detalhes do medicamento/i })).toBeInTheDocument();
    expect(screen.getByText(detailRoutes[index][1])).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expectCurrentScreen("10c");
  }

  await user.click(screen.getByRole("button", { name: "Agora" }));
  expectCurrentScreen("10");
  await user.click(screen.getAllByRole("button", { name: "Ver detalhes" })[0]);
  expectCurrentScreen("10f");
  await user.click(screen.getByRole("button", { name: "Voltar" }));
  expectCurrentScreen("10");
  await user.click(screen.getByRole("checkbox", { name: /confirmar 14:00 • vermífugo chemital/i }));
  expect(screen.getAllByText("Concluído")).toHaveLength(2);
});

test("identifica a origem dos remédios e protege o cadastro da clínica", () => {
  goToScreen("10");
  render(<App />);

  const prednisolone = screen.getByText("18:30 • Prednisolona").closest("article");
  expect(prednisolone).not.toBeNull();
  const clinicMedicine = within(prednisolone as HTMLElement);
  expect(clinicMedicine.getByText("Cadastrado pela clínica")).toBeInTheDocument();
  expect(clinicMedicine.queryByRole("button", { name: /editar remédio/i })).not.toBeInTheDocument();
  expect(
    clinicMedicine.queryByRole("button", { name: /remover remédio/i }),
  ).not.toBeInTheDocument();

  const omega = screen.getByText("08:00 • Ômega 3").closest("article");
  expect(omega).not.toBeNull();
  expect(within(omega as HTMLElement).getByText("Cadastrado por você")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Por segurança, medicamentos cadastrados pela clínica não podem ser editados nem removidos.",
    ),
  ).toBeInTheDocument();
});

test("edita e remove remédios cadastrados pelo tutor", async () => {
  const user = userEvent.setup();
  goToScreen("10");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Editar remédio Ômega 3" }));
  const editDialog = screen.getByRole("dialog", { name: "Editar remédio" });
  const name = within(editDialog).getByLabelText("Nome do medicamento");
  expect(name).toHaveValue("Ômega 3");
  await user.clear(name);
  await user.type(name, "Ômega 3 Premium");
  await user.click(within(editDialog).getByRole("button", { name: "Salvar alterações" }));
  expect(screen.getByText("08:00 • Ômega 3 Premium")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Remover remédio Vermífugo Chemital" }));
  const removeDialog = screen.getByRole("dialog", { name: "Remover remédio" });
  await user.click(within(removeDialog).getByRole("button", { name: "Confirmar remoção" }));
  expect(screen.queryByText("14:00 • Vermífugo Chemital")).not.toBeInTheDocument();
});

test("organiza e centraliza o conteúdo do card de remédio", () => {
  goToScreen("10");
  render(<App />);

  const omega = screen.getByText("08:00 • Ômega 3").closest("article");
  expect(omega).not.toBeNull();
  const header = (omega as HTMLElement).querySelector(".medicine-card-header");
  const footer = (omega as HTMLElement).querySelector(".medicine-card-footer");
  expect(
    (omega as HTMLElement).querySelector('img[src$="medicine-icon.svg"]'),
  ).not.toBeInTheDocument();
  expect(header).toContainElement(within(omega as HTMLElement).getByText("Concluído"));
  expect(footer).toContainElement(
    within(omega as HTMLElement).getByRole("button", { name: "Ver detalhes" }),
  );
  expect(footer).toContainElement(
    within(omega as HTMLElement).getByRole("button", { name: "Editar remédio Ômega 3" }),
  );
  expect(footer).toContainElement(
    within(omega as HTMLElement).getByRole("button", { name: "Remover remédio Ômega 3" }),
  );
  expect(medicineStyles).toMatch(/\.medicine-card-footer\s*\{[^}]*justify-content:\s*flex-start;/s);
});

test("mantém compacto o card de remédio cadastrado pela clínica", () => {
  goToScreen("10");
  render(<App />);

  const prednisolone = screen.getByText("18:30 • Prednisolona").closest("article");
  expect(prednisolone).toHaveClass("is-clinic");
  expect(medicineStyles).toMatch(/\.medicine-card\.is-clinic\s*\{[^}]*min-height:\s*118px;/s);
  expect(medicineStyles).toMatch(
    /\.medicine-card\.is-clinic \.medicine-card-footer\s*\{[^}]*justify-content:\s*flex-start;/s,
  );
});

test("mantém a navegação inferior funcional nas telas fiéis ao figma", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("button", { name: "Pets" }));
  expect(screen.getByRole("heading", { name: /meus pets/i })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Início" }));
  expect(screen.getByRole("heading", { name: /olá, leôncio/i })).toBeInTheDocument();
});

test("abre o perfil do pet pelo frame 8 do figma", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("button", { name: "Pets" }));
  await user.click(screen.getAllByRole("button", { name: /ver perfil/i })[0]);
  expect(screen.getByRole("heading", { name: /perfil do pet/i })).toBeInTheDocument();
  expect(screen.getByText(/rotina do pet/i)).toBeInTheDocument();
});

test("perfil e carteira compartilham o mesmo cabeçalho visual do pet", () => {
  goToScreen("8");
  const profile = render(<App />);

  expect(document.querySelector(".pet-section-header")).toBeInTheDocument();
  expect(document.querySelector(".pet-context-card")).toBeInTheDocument();
  expect(document.querySelector(".pet-section-tabs")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Visão geral" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  profile.unmount();

  goToScreen("11");
  render(<App />);

  expect(document.querySelector(".pet-section-header")).toBeInTheDocument();
  expect(document.querySelector(".pet-context-card")).toBeInTheDocument();
  expect(document.querySelector(".pet-section-tabs")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ver carteira" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("cabeçalho compartilhado fixa a tipografia do Balu nos dois títulos", () => {
  expect(petSectionHeaderStyles).toMatch(
    /\.pet-section-header\s*\{[\s\S]*?h1\s*\{[\s\S]*?font-family:\s*"Plus Jakarta Sans"/,
  );
  expect(petSectionHeaderStyles).toMatch(/h1\s*\{[^}]*font-size:\s*20px/s);
  expect(petSectionHeaderStyles).toMatch(/h1\s*\{[^}]*font-weight:\s*700/s);
  expect(petSectionHeaderStyles).toMatch(/h1\s*\{[^}]*line-height:\s*25px/s);
});

test("padroniza cor e tipografia dos títulos internos de pets", () => {
  [routineStyles, medicineStyles, sharedCareStyles].forEach((styles) => {
    expect(styles).toMatch(/\.figma-pet-header h1\s*\{[^}]*color:\s*#183a78/s);
    expect(styles).toMatch(/\.figma-pet-header h1\s*\{[^}]*font-family:\s*"Plus Jakarta Sans"/s);
    expect(styles).toMatch(/\.figma-pet-header h1\s*\{[^}]*font-size:\s*20px/s);
    expect(styles).toMatch(/\.figma-pet-header h1\s*\{[^}]*font-weight:\s*700/s);
    expect(styles).toMatch(/\.figma-pet-header h1\s*\{[^}]*line-height:\s*25px/s);
  });
});

test("mantém o título alinhado à esquerda depois da seta de voltar", () => {
  expect(petSectionHeaderStyles).toMatch(
    /\.pet-section-header\s*\{[^}]*display:\s*flex[^}]*gap:\s*12px/s,
  );
  expect(petSectionHeaderStyles).not.toMatch(/h1\s*\{[^}]*position:\s*absolute/s);
});

test("ações da próxima consulta seguem a geometria visual do Balu", () => {
  expect(consultationStyles).toMatch(
    /&__decision-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,[^;]+;[\s\S]*?button\s*\{[^}]*min-height:\s*44px[^}]*border:\s*1\.5px[^}]*font-size:\s*11px[^}]*font-weight:\s*700/s,
  );
  expect(consultationStyles).toMatch(
    /&__details-link\s*\{[^}]*min-height:\s*44px[^}]*text-decoration:\s*none/s,
  );
  expect(consultationStyles).toMatch(
    /\.is-confirm\s*\{[^}]*background:\s*#18794e[^}]*color:\s*#fff/s,
  );
  expect(consultationStyles).toMatch(
    /\.is-cancel\s*\{[^}]*background:\s*#fff[^}]*color:\s*#b42318/s,
  );
});

test("mantém o agendamento no final do conteúdo sem seguir a rolagem", () => {
  expect(consultationStyles).toMatch(
    /&__schedule\s*\{[^}]*position:\s*static[^}]*margin-top:\s*28px/s,
  );
  expect(consultationStyles).not.toMatch(/&__schedule\s*\{[^}]*position:\s*fixed/s);
});

test("navega entre visão geral, rotina, remédios e carteira pelas abas do pet", async () => {
  const user = userEvent.setup();
  goToScreen("8");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Ver rotina" }));
  expect(screen.getByRole("heading", { name: /ver rotina/i })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Ver remédios" }));
  expect(screen.getByRole("heading", { name: /medicamentos do pet/i })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Ver carteira" }));
  expect(screen.getByRole("heading", { name: /carteira do pet/i })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Visão geral" }));
  expect(screen.getByRole("heading", { name: /perfil do pet/i })).toBeInTheDocument();
  expectCurrentScreen("8");
});

test("navega pelas telas numeradas 9, 9A, 9B e 9C da rotina", async () => {
  const user = userEvent.setup();
  goToScreen("9");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Semanal" }));
  expectCurrentScreen("9a");
  expect(screen.getByText("Segunda-feira")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Banho" }));
  expectCurrentScreen("9b");
  expect(screen.getByText("Próximo banho")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Histórico" }));
  expectCurrentScreen("9c");
  expect(screen.getByText("Ontem")).toBeInTheDocument();
  const detailButtons = screen.getAllByRole("button", { name: "Ver detalhes" });
  expect(detailButtons).toHaveLength(3);
  await user.click(detailButtons[0]);
  expectCurrentScreen("9d");
  expect(screen.getByRole("heading", { name: "Manhã" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Tarde" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Noite" })).toBeInTheDocument();
  expect(screen.getByText("08:00")).toBeInTheDocument();
  expect(screen.getByText("14:00")).toBeInTheDocument();
  expect(screen.getByText("18:00")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Voltar" }));
  expectCurrentScreen("9c");

  await user.click(screen.getByRole("button", { name: "Hoje" }));
  expectCurrentScreen("9");
  expect(screen.getByText("08:00 • Alimentação")).toBeInTheDocument();
});

test("abre os dados correspondentes a cada registro do histórico da rotina", async () => {
  const user = userEvent.setup();
  goToScreen("9c");
  render(<App />);

  await user.click(screen.getAllByRole("button", { name: "Ver detalhes" })[1]);
  expect(screen.getByText("13 de julho")).toBeInTheDocument();
  expect(screen.getByText("2 cuidados realizados na rotina do Balu.")).toBeInTheDocument();
  expect(screen.queryByText("Vermífugo Chemital")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Voltar" }));
  await user.click(screen.getAllByRole("button", { name: "Ver detalhes" })[2]);
  expect(screen.getByText("12 de julho")).toBeInTheDocument();
  expect(screen.getByText("Escovação")).toBeInTheDocument();
});

test("usa o mesmo padrão visual nos botões Ver detalhes das telas de pets", () => {
  goToScreen("9c");
  const history = render(<App />);
  screen
    .getAllByRole("button", { name: "Ver detalhes" })
    .forEach((button) => expect(button).toHaveClass("pet-details-button"));
  history.unmount();

  goToScreen("11");
  render(<App />);
  screen
    .getAllByRole("button", { name: /Ver detalhes de/ })
    .forEach((button) => expect(button).toHaveClass("pet-details-button"));
});

test("abre os detalhes das rotinas semanal e de banho", async () => {
  const user = userEvent.setup();
  goToScreen("9a");
  const weekly = render(<App />);

  await user.click(screen.getByRole("button", { name: "Ver detalhes de Segunda-feira" }));
  const weeklyDetails = screen.getByRole("dialog", { name: "Detalhes de Segunda-feira" });
  expect(weeklyDetails).toHaveTextContent("Alimentação às 08:00");
  expect(weeklyDetails).toHaveTextContent("Vermífugo às 14:00");
  weekly.unmount();

  goToScreen("9b");
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Ver detalhes do próximo banho" }));
  const bathDetails = screen.getByRole("dialog", { name: "Detalhes do próximo banho" });
  expect(bathDetails).toHaveTextContent("20 de julho");
  expect(bathDetails).toHaveTextContent("Banho completo com hidratação e escovação");
  expect(bathDetails).toHaveTextContent("Responsável: Leôncio");
});

test("centraliza a barra secundária da carteira", () => {
  expect(walletStyles).toMatch(/\.wallet-tabs\s*\{[^}]*justify-content:\s*center;/s);
});

test("edita uma rotina cadastrada pelo tutor", async () => {
  const user = userEvent.setup();
  goToScreen("9");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Editar rotina Alimentação" }));
  const dialog = screen.getByRole("dialog", { name: "Editar rotina" });
  const name = within(dialog).getByLabelText("Nome da rotina");
  expect(name).toHaveValue("Alimentação");
  await user.clear(name);
  await user.type(name, "Café da manhã");
  await user.click(within(dialog).getByRole("button", { name: "Salvar alterações" }));

  expect(screen.queryByRole("dialog", { name: "Editar rotina" })).not.toBeInTheDocument();
  expect(screen.getByText("08:00 • Café da manhã")).toBeInTheDocument();
});

test("remove uma rotina cadastrada pelo tutor após confirmação", async () => {
  const user = userEvent.setup();
  goToScreen("9");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Remover rotina Passeio diário" }));
  const dialog = screen.getByRole("dialog", { name: "Remover rotina" });
  expect(dialog).toHaveTextContent("Passeio diário");
  await user.click(within(dialog).getByRole("button", { name: "Confirmar remoção" }));

  expect(screen.queryByText("18:00 • Passeio diário")).not.toBeInTheDocument();
});

test("marca um cuidado sem depender de uma imagem de tela", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);
  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  expect(screen.getAllByText("Concluído")).toHaveLength(2);
  expect(screen.getByText(/faltam 20 xp para o nível 4/i)).toBeInTheDocument();
});

test("zera o progresso e troca a medalha ao alcançar o nível 4", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);

  await user.click(screen.getByRole("checkbox", { name: /vermífugo chemital/i }));
  await user.click(screen.getByRole("checkbox", { name: /passeio diário/i }));

  expect(screen.getByText(/^nível 4$/i)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /medalha do nível 4/i })).toHaveAttribute(
    "src",
    "/assets/figma/home/xp-level-4-badge.png",
  );
  expect(screen.getByRole("progressbar", { name: /progresso do nível 4/i })).toHaveAttribute(
    "aria-valuenow",
    "0",
  );
});

test("avança pelo fluxo de cadastro até escolher a experiência", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /criar conta/i }));
  expect(screen.getByText("* indica campo obrigatório")).toBeInTheDocument();
  const requiredFields = ["Nome", "E-mail", "Senha", "Confirmar senha"];
  for (const field of requiredFields) {
    expect(screen.getByLabelText(new RegExp(`^${field}$`, "i")).closest("label")).toHaveTextContent(
      `${field} *`,
    );
  }
  await user.type(screen.getByLabelText(/^nome$/i), "Leôncio");
  await user.type(screen.getByLabelText(/^e-mail$/i), "leoncio@email.com");
  await user.type(screen.getByLabelText(/^senha$/i), "12345678");
  await user.type(screen.getByLabelText(/confirmar senha/i), "12345678");
  await user.click(screen.getByRole("button", { name: /^criar conta$/i }));
  expect(screen.getByRole("heading", { name: /cadastrar pet/i })).toBeInTheDocument();
  await fillRequiredPetFields(user);
  await user.click(screen.getByRole("button", { name: /adicionar depois/i }));
  await user.click(screen.getByRole("button", { name: /continuar/i }));
  expect(screen.getByText(/^gamificada$/i)).toBeInTheDocument();
});

test("valida os campos obrigatórios ao criar conta", async () => {
  const user = userEvent.setup();
  goToScreen("2");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /^criar conta$/i }));

  expect(screen.getByRole("heading", { name: /criar conta/i })).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Preencha os campos obrigatórios para continuar.",
  );

  const expectations = [
    ["Nome", "Informe o nome."],
    ["E-mail", "Informe o e-mail."],
    ["Senha", "Informe a senha."],
    ["Confirmar senha", "Confirme a senha."],
  ] as const;

  for (const [label, message] of expectations) {
    const input = screen.getByLabelText(new RegExp(`^${label}$`, "i"));
    const error = screen.getByText(message);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
  }

  const nameInput = screen.getByLabelText(/^nome$/i);
  expect(nameInput).toHaveFocus();
  await user.type(nameInput, "Leôncio");
  expect(screen.queryByText("Informe o nome.")).not.toBeInTheDocument();
  expect(nameInput).toHaveAttribute("aria-invalid", "false");
});

test("exige uma experiência antes de começar", async () => {
  const user = userEvent.setup();
  goToScreen("4");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /começar jornada/i }));

  expect(screen.getByRole("heading", { name: /escolha sua experiência/i })).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Preencha os campos obrigatórios para continuar.",
  );
  const group = screen.getByRole("group", { name: /opções de experiência/i });
  const error = screen.getByText("Selecione uma experiência para continuar.");
  expect(group).toHaveAttribute("aria-invalid", "true");
  expect(group).toHaveAttribute("aria-describedby", error.id);
  expect(screen.getByRole("button", { name: /tradicional/i })).toHaveFocus();

  await user.click(screen.getByRole("button", { name: /gamificada/i }));
  expect(error).not.toBeInTheDocument();
  expect(group).toHaveAttribute("aria-invalid", "false");
});

test("volta corretamente nas três etapas do onboarding", async () => {
  const user = userEvent.setup();
  const steps = [
    ["2", /criar conta/i, /entrar no balu/i],
    ["3", /cadastrar pet/i, /criar conta/i],
    ["4", /escolha sua experiência/i, /cadastrar pet/i],
  ] as const;

  for (const [route, currentHeading, targetHeading] of steps) {
    goToScreen(route);
    const rendered = render(<App />);
    const backButton = screen.getByRole("button", { name: /^voltar$/i });
    const heading = screen.getByRole("heading", { name: currentHeading });
    const header = heading.closest("header");
    expect(backButton).toHaveAttribute("type", "button");
    expect(backButton).toHaveClass("h-11", "w-11");
    expect(header).toContainElement(backButton);

    await user.click(backButton);

    expect(screen.getByRole("heading", { name: targetHeading })).toBeInTheDocument();
    rendered.unmount();
  }

  for (const route of ["4t", "4g"]) {
    goToScreen(route);
    const rendered = render(<App />);
    expect(screen.queryByRole("button", { name: /^voltar$/i })).not.toBeInTheDocument();
    rendered.unmount();
  }
});

test("mostra o progresso correto nas três etapas do onboarding", () => {
  const steps = [
    ["2", "Criar sua conta", "1", "33%"],
    ["3", "Cadastrar seu pet", "2", "67%"],
    ["4", "Escolher experiência", "3", "100%"],
  ] as const;

  for (const [route, label, value, percentage] of steps) {
    goToScreen(route);
    const rendered = render(<App />);
    const progress = screen.getByRole("progressbar", { name: label });
    expect(progress).toHaveAttribute("aria-valuemin", "1");
    expect(progress).toHaveAttribute("aria-valuemax", "3");
    expect(progress).toHaveAttribute("aria-valuenow", value);
    expect(screen.getByText(percentage)).toBeInTheDocument();
    rendered.unmount();
  }
});

test("avança do login para criação de conta", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await user.click(screen.getByRole("button", { name: /criar conta/i }));
  expect(screen.getByRole("heading", { name: /criar conta/i })).toBeInTheDocument();
});

test("renderiza estados distintos das homes exatamente como o protótipo", () => {
  const states = [
    ["5", /faltam 45 xp para o nível 4/i],
    ["5a", /faltam 20 xp para o nível 4/i],
    ["5b", /parabéns! você evoluiu de nível/i],
    ["5t", /vermífugo às 14:00/i],
    ["5ta", /passeio diário às 18:00/i],
    ["5tb", /próxima vacina em agosto/i],
  ] as const;

  for (const [tela, content] of states) {
    goToScreen(tela);
    const { unmount } = render(<App />);
    expect(screen.getByText(content)).toBeInTheDocument();
    unmount();
  }
});

test("não usa emojis como substitutos dos assets do figma na home", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  const { container } = render(<App />);
  await enterAsAdmin(user);

  expect(container).not.toHaveTextContent(/🐶|🐾|🏵️|🔔/u);
  expect(container.querySelector('img[src="/assets/figma/home/11.svg"]')).toBeInTheDocument();
  expect(
    container.querySelector('img[src="/assets/figma/home/xp-level-badge.png"]'),
  ).toBeInTheDocument();
});

test("mantém as seleções tradicional e gamificada em frames diferentes", () => {
  goToScreen("4t");
  const traditional = render(<App />);
  expect(document.querySelector('[data-experience="traditional"]')).toBeInTheDocument();
  traditional.unmount();

  goToScreen("4g");
  render(<App />);
  expect(document.querySelector('[data-experience="gamified"]')).toBeInTheDocument();
});

test("passa pela confirmação 4T antes de abrir a home tradicional", async () => {
  const user = userEvent.setup();
  goToScreen("4");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /tradicional/i }));
  await user.click(screen.getByRole("button", { name: /começar jornada/i }));

  expect(document.querySelector('[data-figma-node="393:2"]')).toBeInTheDocument();
  expectCurrentScreen("4t");

  await user.click(screen.getByRole("button", { name: /começar jornada/i }));
  expect(screen.getByText(/vermífugo às 14:00/i)).toBeInTheDocument();
  expectCurrentScreen("5t");
  expect(localStorage.getItem("balu-experience")).toBe("traditional");
});

test("salva a experiência gamificada escolhida no onboarding", async () => {
  const user = userEvent.setup();
  localStorage.clear();
  goToScreen("4");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /gamificada/i }));
  await user.click(screen.getByRole("button", { name: /começar jornada/i }));

  expect(localStorage.getItem("balu-experience")).toBe("gamified");
  expect(screen.getByText(/faltam 45 xp para o nível 4/i)).toBeInTheDocument();
});

test("reproduz perfil e notificações com os assets do Figma e a barra inferior", () => {
  goToScreen("6");
  const profile = render(<App />);

  expect(screen.getByRole("heading", { name: /perfil do tutor/i })).toBeInTheDocument();
  expect(screen.getByText("Tutor principal")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Início" })).toBeInTheDocument();
  profile.unmount();

  goToScreen("6a");
  const { container } = render(<App />);

  expect(screen.getByRole("heading", { name: /notificações/i })).toBeInTheDocument();
  expect(container.querySelectorAll(".notifications-screen article")).toHaveLength(6);
  expect(screen.getAllByRole("button", { name: /dispensar/i })).toHaveLength(6);
  expect(screen.getByRole("button", { name: "Início" })).toBeInTheDocument();
  expect(
    container.querySelectorAll(
      '.notifications-screen__icon[src^="/assets/figma/inicio/notification-"]',
    ),
  ).toHaveLength(6);
});

test("abre o convite pelo cuidado compartilhado e volta", async () => {
  const user = userEvent.setup();
  goToScreen("12");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /convidar/i }));

  expect(screen.getByRole("heading", { name: /convidar tutor/i })).toBeInTheDocument();
  expectCurrentScreen("13");

  await user.click(screen.getByRole("button", { name: "Voltar" }));

  expect(screen.getByRole("heading", { name: /cuidado compartilhado/i })).toBeInTheDocument();
  expectCurrentScreen("12");
});

test("usa Plus Jakarta Sans nos controles de cuidado compartilhado e convite", () => {
  goToScreen("12");
  const sharedCare = render(<App />);
  expect(
    getComputedStyle(screen.getByRole("button", { name: /convidar tutor/i })).fontFamily,
  ).toContain("Plus Jakarta Sans");
  sharedCare.unmount();

  goToScreen("13");
  render(<App />);
  expect(
    getComputedStyle(screen.getByRole("button", { name: /copiar código/i })).fontFamily,
  ).toContain("Plus Jakarta Sans");
});
