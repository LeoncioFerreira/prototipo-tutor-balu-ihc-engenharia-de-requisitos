import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import App from "../../app/App";
import { pathForScreen } from "../../app/routes";

function goToScreen(screen: string) {
  const path = pathForScreen(screen);
  if (!path) throw new Error("Rota não mapeada: " + screen);
  window.history.pushState({}, "", path);
}

function expectCurrentScreen(screen: string) {
  expect(window.location.pathname).toBe(pathForScreen(screen));
}

async function enterAsAdmin(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/e-mail/i), "admin");
  await user.type(screen.getByLabelText(/^senha$/i), "123");
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
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
  expect(actions).toContainElement(
    screen.getByRole("button", { name: "Perguntas frequentes" }),
  );
  expect(actions).toContainElement(screen.getByRole("button", { name: "Acionar Emergência" }));
  expect(screen.queryByRole("button", { name: "Dicas de Saúde" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Remédios" })).not.toBeInTheDocument();
  expect(controls).toContainElement(screen.getByLabelText("Mensagem"));
  expect(screen.getByLabelText("Mensagem").tagName).toBe("TEXTAREA");
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

test("abre a tela de adicionar pet pelo seletor da home", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);
  await enterAsAdmin(user);

  await user.click(screen.getByRole("button", { name: /^adicionar$/i }));

  expect(screen.getByRole("heading", { name: /adicionar pet/i })).toBeInTheDocument();
  expectCurrentScreen("7a");
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

test("abre o Clube dos Caramelos pelo botão Entrar no clube", async () => {
  const user = userEvent.setup();
  goToScreen("15");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Entrar no clube" }));

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
  await user.click(within(dialog).getByRole("button", { name: "Publicar" }));

  expect(screen.queryByRole("dialog", { name: "Criar publicação" })).not.toBeInTheDocument();
  expect(screen.getByText("Passeio no parque hoje.")).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("Publicação criada com sucesso");
});

test("confirma o salvamento do remédio antes de voltar", async () => {
  const user = userEvent.setup();
  goToScreen("10h");
  render(<App />);

  await user.type(screen.getByPlaceholderText("Ex: Vermífugo Chemital"), "NexGard");
  await user.type(screen.getByPlaceholderText("Ex: 1/2 comprimido"), "1 comprimido");
  await user.type(screen.getByLabelText("Horário *"), "14:00");
  await user.click(screen.getByRole("button", { name: "Salvar remédio" }));

  expect(screen.getByRole("status")).toHaveTextContent("Remédio salvo com sucesso");
  expect(screen.getByRole("heading", { name: "Adicionar remédio" })).toBeInTheDocument();
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

  await user.click(screen.getByRole("button", { name: "Continuar" }));

  const nameInput = screen.getByRole("textbox", { name: /Nome do pet/ });
  expect(nameInput).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Informe o nome do pet.")).toBeInTheDocument();
  expect(nameInput).toHaveFocus();
});

test("explica que os dados permanecem salvos ao adicionar tutor depois", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  await user.click(screen.getByRole("button", { name: "Adicionar depois" }));
  expect(screen.getByRole("status")).toHaveTextContent(
    "Os dados preenchidos do pet serão mantidos",
  );
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
  expect(screen.getAllByRole("button", { name: /marcar consulta/i })).toHaveLength(1);
  expect(screen.getByRole("button", { name: /adicionar novo pet/i })).toBeInTheDocument();
});

test("abre o agendamento pelo botão Marcar Consulta", async () => {
  const user = userEvent.setup();
  goToScreen("7");
  render(<App />);

  await user.click(screen.getByRole("button", { name: /marcar consulta/i }));

  expect(screen.getByRole("dialog", { name: /marcar consulta/i })).toBeInTheDocument();
  expect(screen.getByText("Agendamento para Balu")).toBeInTheDocument();
});

test("exibe o formulário de adicionar pet sem marcador emoji", () => {
  goToScreen("7a");
  render(<App />);

  expect(screen.getByRole("heading", { name: /adicionar pet/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/nome do pet/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/raça/i)).toBeInTheDocument();
  expect(screen.getByText(/vincular outros tutores/i)).toBeInTheDocument();
  expect(screen.queryByText("🐾")).not.toBeInTheDocument();
});

test("mantém as ações de cuidado compartilhado juntas no cadastro do pet", () => {
  goToScreen("3");
  render(<App />);

  const actions = screen.getByRole("group", { name: /ações de cuidado compartilhado/i });
  expect(actions).toContainElement(screen.getByRole("button", { name: /convidar tutor/i }));
  expect(actions).toContainElement(screen.getByRole("button", { name: /adicionar depois/i }));
});

test("cadastro do pet identifica todos os campos obrigatórios", () => {
  goToScreen("3");
  render(<App />);

  expect(screen.getByText("* indica campo obrigatório")).toBeInTheDocument();
  expect(screen.getAllByText("*", { selector: ".required-mark" })).toHaveLength(4);
  expect(screen.getByLabelText(/nome do pet/i)).toBeRequired();
  expect(screen.getByLabelText(/raça/i)).toBeRequired();
  expect(screen.getByLabelText(/sexo/i)).toBeRequired();
  expect(screen.getByLabelText(/idade/i)).toBeRequired();
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

  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.type(screen.getByLabelText(/sexo/i), "Macho");
  await user.type(screen.getByLabelText(/idade/i), "2 anos");
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

  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.type(screen.getByLabelText(/sexo/i), "Macho");
  await user.type(screen.getByLabelText(/idade/i), "2 anos");
  await user.click(screen.getByRole("button", { name: /continuar/i }));

  expect(screen.getByRole("heading", { name: /escolha sua experiência/i })).toBeInTheDocument();
  expectCurrentScreen("4");
});

test("cadastro do pet mantém apenas uma opção de cuidado compartilhado selecionada", async () => {
  const user = userEvent.setup();
  goToScreen("3");
  render(<App />);

  const invite = screen.getByRole("button", { name: /convidar tutor/i });
  const addLater = screen.getByRole("button", { name: /adicionar depois/i });
  const familyCode = screen.getByRole("button", { name: /entrar com código da família/i });

  await user.click(invite);
  expect(invite).toHaveAttribute("aria-pressed", "true");

  await user.click(addLater);
  expect(invite).toHaveAttribute("aria-pressed", "false");
  expect(addLater).toHaveAttribute("aria-pressed", "true");

  await user.click(familyCode);
  expect(addLater).toHaveAttribute("aria-pressed", "false");
  expect(familyCode).toHaveAttribute("aria-pressed", "true");
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
    ["11", /abrir carteira pet do gov/i],
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
  await user.type(screen.getByLabelText(/nome do pet/i), "Balu");
  await user.type(screen.getByLabelText(/raça/i), "Samoieda");
  await user.type(screen.getByLabelText(/sexo/i), "Macho");
  await user.type(screen.getByLabelText(/idade/i), "2 anos");
  await user.click(screen.getByRole("button", { name: /adicionar depois/i }));
  await user.click(screen.getByRole("button", { name: /continuar/i }));
  expect(screen.getByText(/^gamificada$/i)).toBeInTheDocument();
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
