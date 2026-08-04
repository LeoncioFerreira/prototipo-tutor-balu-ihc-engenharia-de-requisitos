# Ajustes do Chatbot Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a consulta digitada de vacinas exibir os registros do Balu e manter FAQ, atalhos e envio corretamente posicionados em 393 px.

**Architecture:** Preservar o motor conversacional e a estrutura da tela, cobrindo o fluxo real pelo componente `App`. Ajustar apenas a semântica do acionador de FAQ e o SCSS da tela, usando grid responsivo, acordeão em cartões e espaço reservado para o envio.

**Tech Stack:** React 18, TypeScript, SCSS, Vitest, Testing Library e jsdom.

## Global Constraints

- Não criar atalho de vacinas.
- Preservar os quatro atalhos existentes e os textos atuais.
- Validar o layout na largura de 393 px.
- Preservar Enter para enviar e Control+Enter para nova linha.
- Não alterar outras telas ou a navegação principal.

---

### Task 1: Cobrir a consulta de vacinas e o acordeão pela interface

**Files:**
- Modify: `src/test/app/App.flow.test.tsx`
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx`

**Interfaces:**
- Consumes: `ChatbotBaluScreen`, `createChatSession(demoPets[0])` e o botão acessível `Perguntas frequentes`.
- Produces: fluxo observável que lista Antirrábica e V10 múltipla; acionador com `aria-expanded` e `aria-controls="chatbot-faq"`.

- [ ] **Step 1: Escrever o teste de regressão da consulta digitada**

Adicionar em `src/test/app/App.flow.test.tsx`:

```tsx
test("lista as vacinas cadastradas ao perguntar pelo chat", async () => {
  const user = userEvent.setup();
  goToScreen("14");
  render(<App />);

  await user.type(screen.getByLabelText("Mensagem"), "Tem vacinas?");
  await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

  expect(screen.getByText(/Vacinas de Balu/)).toHaveTextContent("Antirrábica");
  expect(screen.getByText(/Vacinas de Balu/)).toHaveTextContent("V10 múltipla");
});
```

- [ ] **Step 2: Executar o teste focal e confirmar o estado atual**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "lista as vacinas cadastradas"`

Expected: PASS se o fluxo já estiver conectado ao contexto correto; qualquer falha deve ser investigada no caminho `Screen.tsx` → `createChatSession(demoPets[0])` antes de mudar a implementação.

- [ ] **Step 3: Escrever o teste acessível do acordeão**

Atualizar o teste `oferece ajuda contextual no assistente virtual` para verificar:

```tsx
const faqButton = screen.getByRole("button", { name: "Perguntas frequentes" });
expect(faqButton).toHaveAttribute("aria-expanded", "false");
expect(faqButton).toHaveAttribute("aria-controls", "chatbot-faq");

await user.click(faqButton);

expect(faqButton).toHaveAttribute("aria-expanded", "true");
expect(screen.getByRole("region", { name: "Perguntas frequentes" })).toHaveAttribute(
  "id",
  "chatbot-faq",
);
```

- [ ] **Step 4: Executar o teste e confirmar que falha pela ausência dos atributos**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "oferece ajuda contextual"`

Expected: FAIL indicando ausência de `aria-expanded` ou `aria-controls`.

- [ ] **Step 5: Implementar a semântica mínima no acionador e painel**

Em `Screen.tsx`, alterar o botão e o painel para:

```tsx
<button
  type="button"
  aria-expanded={faqOpen}
  aria-controls="chatbot-faq"
  onClick={() => setFaqOpen((value) => !value)}
>
  Perguntas frequentes
</button>
```

```tsx
<section id="chatbot-faq" className="chatbot-screen__faq" aria-label="Perguntas frequentes">
```

- [ ] **Step 6: Executar os testes focais**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "vacinas cadastradas|oferece ajuda contextual"`

Expected: 2 testes PASS.

- [ ] **Step 7: Commit**

```bash
git add src/test/app/App.flow.test.tsx src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx
git commit -m "test: cobre vacinas e acordeão do chatbot"
```

### Task 2: Corrigir o layout mobile dos controles

**Files:**
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.scss`
- Test: `src/test/app/App.flow.test.tsx`

**Interfaces:**
- Consumes: classes `chatbot-screen__controls`, `chatbot-screen__chips`, `chatbot-screen__faq` e `chatbot-screen__input`.
- Produces: grade de duas colunas, FAQ em cartões, controles com rolagem vertical e botão de envio de 44 × 44 px dentro do campo.

- [ ] **Step 1: Reforçar o teste estrutural dos controles**

No teste `mantém alerta, atalhos e envio juntos no bloco de controles do chat`, verificar os quatro atalhos e o botão de envio:

```tsx
expect(within(controls).getAllByRole("button")).toEqual(
  expect.arrayContaining([
    screen.getByRole("button", { name: "Perguntas frequentes" }),
    screen.getByRole("button", { name: "Acionar Emergência" }),
    screen.getByRole("button", { name: "Dicas de Saúde" }),
    screen.getByRole("button", { name: "Remédios" }),
    screen.getByRole("button", { name: "Enviar mensagem" }),
  ]),
);
```

- [ ] **Step 2: Aplicar o layout responsivo no SCSS**

Em `Screen.scss`:

```scss
&__controls {
  display: grid;
  min-height: 0;
  max-height: 46%;
  flex: 0 1 auto;
  gap: 10px;
  margin-top: 12px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 2px;
}

&__chips {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  button {
    width: 100%;
    min-height: 40px;
    height: auto;
    padding: 8px 10px;
    white-space: normal;
  }
}
```

- [ ] **Step 3: Estilizar o acordeão como cartões**

Adicionar em `Screen.scss`:

```scss
&__faq {
  display: grid;
  gap: 8px;

  details {
    border: 1px solid #d8e5ee;
    border-radius: 12px;
    background: #fff;
    overflow: hidden;
  }

  summary {
    cursor: pointer;
    padding: 11px 12px;
    color: #183a78;
    font-size: 11px;
    font-weight: 700;
  }

  p {
    margin: 0;
    border-top: 1px solid #edf2f7;
    padding: 10px 12px 12px;
    color: #4a5568;
    font-size: 10px;
    line-height: 15px;
  }
}
```

- [ ] **Step 4: Corrigir o campo e o botão de envio**

Atualizar `chatbot-screen__input` para usar `display: flex`, `align-items: center` e `padding-right: 56px`; deixar o `textarea` com `width: 100%` e `box-sizing: border-box`. No botão, usar `right: 8px`, `top: 50%`, `width: 44px`, `height: 44px` e `transform: translateY(-50%)`; manter a imagem em 32 × 32 px.

- [ ] **Step 5: Executar o teste focal da tela**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "chat|assistente virtual"`

Expected: todos os testes selecionados PASS.

- [ ] **Step 6: Inspecionar a tela em 393 px**

Abrir `/comunicacao/chatbot` no protótipo local com viewport de 393 px e confirmar:

- os quatro atalhos aparecem sem corte;
- “Remédios” está dentro da grade;
- o acordeão não cobre a navegação inferior;
- o envio aparece dentro do campo;
- a resposta a “Tem vacinas?” mostra as duas vacinas.

- [ ] **Step 7: Executar as verificações completas**

Run: `npm test`

Expected: 120 testes existentes mais os novos testes PASS.

Run: `npm run lint`

Expected: exit code 0.

Run: `npm run build`

Expected: exit code 0.

Run: `git diff --check`

Expected: sem saída e exit code 0.

- [ ] **Step 8: Commit**

```bash
git add src/features/comunicacao/tela-14-chatbot-balu/Screen.scss src/test/app/App.flow.test.tsx
git commit -m "style: ajusta controles mobile do chatbot"
```
