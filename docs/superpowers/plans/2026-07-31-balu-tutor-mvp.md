# Balu Tutor MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar no GitHub um MVP mobile-first do Balu Tutor, fiel às telas do Figma e navegável com dados demonstrativos locais.

**Architecture:** Um shell React roteia as áreas do app e compõe telas com componentes visuais próprios. Dados de demonstração ficam em JSON; uma camada pequena de domínio atualiza estado local e resolve respostas seguras do chatbot. Cada frame do Figma é inspecionado via MCP, seus assets são exportados e as telas são validadas por captura em tamanho móvel.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS 4, React Router 7, Lucide React, Vitest e Testing Library.

---

## Estrutura de arquivos

```text
src/
  app/App.tsx                 shell, rotas e estado de demonstração
  components/ui.tsx           componentes visuais compartilhados
  data/demo-data.json         tutor, pets, rotina, notificações e comunidade
  data/chatbot-responses.json intenções e mensagens seguras do Balu
  features/chatbot/matcher.ts normalização e seleção de intenção
  features/chatbot/matcher.test.ts
  features/screens.tsx        telas e fluxos do Tutor
  styles/index.css            Tailwind e tokens Balu
  test/setup.ts               configuração dos testes
README.md                     execução, limites do MVP e origem do design
requisitos/README.md          índice dos requisitos usados na disciplina
```

### Task 1: Extrair a referência do Figma e registrar os assets

**Files:**
- Create: `design-reference/README.md`
- Create: `public/assets/figma/.gitkeep`

- [ ] **Step 1: Obter estrutura de cada frame pelo MCP**

Use `figma_get_metadata` para o nó `0:1`; para cada frame retornado, chame `figma_get_design_context` com o `nodeId` correspondente e `skillNames: "figma-design-to-code"`.

- [ ] **Step 2: Exportar imagens necessárias pelo MCP**

Use `figma_download_assets` para cada frame que contenha imagem/fill. Baixe os bytes exportados para `public/assets/figma/`, preservando extensão e origem.

- [ ] **Step 3: Documentar a referência**

Registre em `design-reference/README.md` a URL do Figma, IDs dos frames, dimensões, fontes, cores e assets usados. Se o MCP recusar um nó, registre a mensagem e use `figma_get_screenshot` apenas para validação visual, nunca como substituição silenciosa.

- [ ] **Step 4: Commit**

```bash
git add design-reference public/assets/figma
git commit -m "chore: add Figma design reference"
```

### Task 2: Inicializar o projeto e os testes

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`, `src/styles/index.css`, `src/test/setup.ts`

- [ ] **Step 1: Criar o teste de renderização inicial**

```tsx
import { render, screen } from "@testing-library/react";
import App from "../app/App";

test("renders the Balu entry screen", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /entrar no balu/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar o teste e confirmar falha**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because `App` does not exist.

- [ ] **Step 3: Criar o shell mínimo e configuração**

Implemente `App` com o título `Entrar no Balu`, configure Tailwind, Vitest e Testing Library no Vite.

- [ ] **Step 4: Executar o teste e confirmar sucesso**

Run: `npm test -- src/app/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html src
git commit -m "chore: scaffold Balu tutor application"
```

### Task 3: Implementar o domínio seguro do chatbot em JSON

**Files:**
- Create: `src/data/chatbot-responses.json`
- Create: `src/features/chatbot/matcher.ts`
- Create: `src/features/chatbot/matcher.test.ts`

- [ ] **Step 1: Escrever os testes que falham**

```ts
import { findChatbotReply } from "./matcher";

test("returns the matching care answer", () => {
  expect(findChatbotReply("qual vacina o Balu precisa?").kind).toBe("answer");
});

test("returns a safe fallback for an unknown question", () => {
  expect(findChatbotReply("me conte uma piada").kind).toBe("fallback");
});

test("marks warning symptoms as urgent", () => {
  expect(findChatbotReply("meu pet está sem respirar").kind).toBe("urgent");
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm test -- src/features/chatbot/matcher.test.ts`

Expected: FAIL because `findChatbotReply` is missing.

- [ ] **Step 3: Implementar o mínimo**

Defina JSON com intenções `vacina`, `alimentacao`, `passeio`, `medicamento` e sinais urgentes. Normalize texto com `normalize("NFD")`, remoção de diacríticos e lowercase; retorne o item com maior número de palavras-chave presentes, fallback seguro quando a pontuação for zero e urgência antes da busca comum.

- [ ] **Step 4: Executar e confirmar sucesso**

Run: `npm test -- src/features/chatbot/matcher.test.ts`

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/chatbot-responses.json src/features/chatbot
git commit -m "feat: add JSON-powered Balu chatbot"
```

### Task 4: Criar tokens e componentes visuais fiéis ao Figma

**Files:**
- Create: `src/components/ui.tsx`
- Modify: `src/styles/index.css`
- Create: `src/components/ui.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

```tsx
test("renders a labelled bottom navigation item", () => {
  render(<BottomNav active="home" onNavigate={vi.fn()} />);
  expect(screen.getByRole("button", { name: /início/i })).toBeInTheDocument();
});

test("renders a task action", () => {
  render(<TaskItem task={task} onComplete={vi.fn()} onPostpone={vi.fn()} />);
  expect(screen.getByRole("button", { name: /concluir/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm test -- src/components/ui.test.tsx`

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Implementar os componentes**

Implemente `PrimaryButton`, `OutlinedButton`, `Card`, `StatusTag`, `PetHeader`, `TaskItem`, `ChatBubble` e `BottomNav`. Crie tokens CSS para o azul, aqua, fundos, bordas, raios e sombras medidos na referência Figma. Use largura móvel e áreas de toque de no mínimo 44px.

- [ ] **Step 4: Executar e confirmar sucesso**

Run: `npm test -- src/components/ui.test.tsx`

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components src/styles/index.css
git commit -m "feat: add Balu mobile design system"
```

### Task 5: Criar entrada, onboarding e shell de navegação

**Files:**
- Create: `src/app/App.tsx`
- Create: `src/features/screens.tsx`
- Create: `src/data/demo-data.json`
- Create: `src/app/App.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
test("moves from sign in to the home screen", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /^entrar$/i }));
  expect(await screen.findByRole("heading", { name: /olá, leôncio/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because the transition is absent.

- [ ] **Step 3: Implementar fluxo**

Implemente `Login`, `CreateAccount`, `CreatePet`, `ExperienceChoice` e `Home`. Os botões avançam pelas telas do Figma; `Entrar` abre a Home com dados demonstrativos. A navegação inferior atualiza a área ativa.

- [ ] **Step 4: Executar e confirmar sucesso**

Run: `npm test -- src/app/App.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features/screens.tsx src/data/demo-data.json
git commit -m "feat: add tutor onboarding and home"
```

### Task 6: Implementar pets, rotina e saúde

**Files:**
- Modify: `src/features/screens.tsx`
- Create: `src/features/pet-flow.test.tsx`

- [ ] **Step 1: Escrever o teste que falha**

```tsx
test("marks a routine task as completed", async () => {
  const user = userEvent.setup();
  render(<App initialRoute="/home" />);
  await user.click(screen.getAllByRole("button", { name: /concluir/i })[0]);
  expect(screen.getByText(/concluída/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm test -- src/features/pet-flow.test.tsx`

Expected: FAIL because the completion mutation is absent.

- [ ] **Step 3: Implementar fluxo**

Implemente `Pets`, `AddPet`, `PetProfile`, `SharedCare`, `InviteTutor`, `Routine`, `Medications`, `HealthCard` e `ClinicLink`, usando os cards, tags e ações vistos no Figma. Concluir/adiar rotina deve alterar apenas o estado local e persistir no `localStorage`.

- [ ] **Step 4: Executar e confirmar sucesso**

Run: `npm test -- src/features/pet-flow.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/screens.tsx src/features/pet-flow.test.tsx
git commit -m "feat: add pet care and health flows"
```

### Task 7: Implementar notificações, chat, comunidade e perfil

**Files:**
- Modify: `src/features/screens.tsx`
- Create: `src/features/community-chat.test.tsx`

- [ ] **Step 1: Escrever os testes que falham**

```tsx
test("sends a question and shows the chatbot response", async () => {
  const user = userEvent.setup();
  render(<App initialRoute="/chat" />);
  await user.type(screen.getByLabelText(/mensagem/i), "qual vacina o Balu precisa?");
  await user.click(screen.getByRole("button", { name: /enviar/i }));
  expect(await screen.findByText(/vacina/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Executar e confirmar falha**

Run: `npm test -- src/features/community-chat.test.tsx`

Expected: FAIL because the chat interaction is absent.

- [ ] **Step 3: Implementar telas**

Implemente `Notifications`, `Chat`, `Communities`, `CommunityDetail` e `TutorProfile`. O chat usa somente `findChatbotReply`; postar na comunidade adiciona conteúdo demonstrativo local; configurações exibem confirmação sem integração externa.

- [ ] **Step 4: Executar e confirmar sucesso**

Run: `npm test -- src/features/community-chat.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/screens.tsx src/features/community-chat.test.tsx
git commit -m "feat: add tutor communication flows"
```

### Task 8: Validar fidelidade, documentar e publicar no GitHub

**Files:**
- Create: `README.md`
- Create: `requisitos/README.md`
- Modify: `design-reference/README.md`

- [ ] **Step 1: Validar cada rota no viewport móvel**

Execute `npm run dev`, capture cada rota em 390px de largura e compare com o frame correspondente do Figma MCP. Corrija somente diferenças observáveis de fonte, espaçamento, cor, borda, asset ou hierarquia.

- [ ] **Step 2: Executar verificação final**

Run: `npm test && npm run build`

Expected: todos os testes passam e o build termina sem erros.

- [ ] **Step 3: Documentar**

O README deve conter pré-requisitos, `npm install`, `npm run dev`, `npm test`, `npm run build`, escopo do chatbot local e link para Figma. `requisitos/README.md` deve ligar o MVP às histórias de usuário relevantes, incluindo US02, US09, US17, US24, US33 e US59.

- [ ] **Step 4: Commit**

```bash
git add README.md requisitos design-reference
git commit -m "docs: add MVP setup and requirements"
```

- [ ] **Step 5: Criar e enviar o repositório GitHub**

Run:

```bash
gh repo create "Prototipo-tutor-Balu-ihc" --public --source . --remote origin --push
```

Expected: URL do repositório remoto e branch `main` enviada com histórico Conventional Commits.
