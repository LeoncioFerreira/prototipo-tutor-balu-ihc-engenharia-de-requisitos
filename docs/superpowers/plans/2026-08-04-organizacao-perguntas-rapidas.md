# Organização das Perguntas Rápidas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar os controles rápidos do chatbot em um grupo de ajuda comum e uma ação de emergência separada e destacada.

**Architecture:** Alterar somente a marcação semântica da tela e seu SCSS. Os callbacks atuais serão preservados; os testes de fluxo verificarão o agrupamento pelo nome acessível e a separação da emergência.

**Tech Stack:** React 18, TypeScript, SCSS, Vitest, Testing Library e jsdom.

## Global Constraints

- Preservar os textos e comportamentos dos quatro controles existentes.
- Não criar novos atalhos ou perguntas.
- Manter “Acionar Emergência” fora do grupo “Perguntas rápidas”.
- Manter funcionamento por teclado e áreas de toque mobile.
- Não alterar outras telas nem o motor conversacional.

---

### Task 1: Separar perguntas rápidas e emergência

**Files:**
- Modify: `src/test/app/App.flow.test.tsx`
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx`
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.scss`

**Interfaces:**
- Consumes: `sendMessage(text: string)`, estado `faqOpen` e região `Controles da conversa`.
- Produces: grupo acessível `Perguntas rápidas` com três botões e botão `.chatbot-screen__emergency-action` separado.

- [ ] **Step 1: Escrever o teste de agrupamento**

Atualizar `mantém alerta, atalhos e envio juntos no bloco de controles do chat` em `App.flow.test.tsx`:

```tsx
const controls = screen.getByRole("region", { name: "Controles da conversa" });
const quickQuestions = within(controls).getByRole("group", { name: "Perguntas rápidas" });

expect(quickQuestions).toContainElement(
  screen.getByRole("button", { name: "Perguntas frequentes" }),
);
expect(quickQuestions).toContainElement(screen.getByRole("button", { name: "Dicas de Saúde" }));
expect(quickQuestions).toContainElement(screen.getByRole("button", { name: "Remédios" }));
expect(quickQuestions).not.toContainElement(
  screen.getByRole("button", { name: "Acionar Emergência" }),
);
expect(controls).toContainElement(screen.getByRole("button", { name: "Acionar Emergência" }));
```

- [ ] **Step 2: Executar o teste e confirmar a falha correta**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "mantém alerta, atalhos"`

Expected: FAIL porque ainda não existe um grupo acessível chamado “Perguntas rápidas”.

- [ ] **Step 3: Implementar a estrutura semântica**

Em `Screen.tsx`, substituir o contêiner atual dos quatro botões por:

```tsx
<section className="chatbot-screen__quick-actions" aria-labelledby="quick-actions-title">
  <h2 id="quick-actions-title">Perguntas rápidas</h2>
  <div className="chatbot-screen__chips" role="group" aria-label="Perguntas rápidas">
    {/* Perguntas frequentes, Dicas de Saúde e Remédios */}
  </div>
</section>
<button
  type="button"
  className="chatbot-screen__emergency-action"
  onClick={() => sendMessage("emergência")}
>
  <TriangleAlert aria-hidden="true" size={18} />
  Acionar Emergência
</button>
```

Manter no botão de FAQ os atributos `aria-expanded` e `aria-controls` existentes e manter os callbacks atuais de Dicas de Saúde e Remédios.

- [ ] **Step 4: Implementar o layout visual**

Em `Screen.scss`, definir:

```scss
&__quick-actions {
  display: grid;
  gap: 7px;

  h2 {
    margin: 0;
    color: #4a5568;
    font-size: 10px;
    font-weight: 700;
  }
}

&__chips {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  button:first-child {
    grid-column: 1 / -1;
  }
}

&__emergency-action {
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  background: #fff1f2;
  color: #b91c1c;
  font-size: 11px;
  font-weight: 700;
}
```

Remover `.is-emergency` de `chatbot-screen__chips`, pois a emergência deixa de pertencer ao grupo.

- [ ] **Step 5: Executar os testes focais**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "chat|assistente virtual|mantém alerta, atalhos"`

Expected: todos os testes selecionados PASS.

- [ ] **Step 6: Executar as verificações completas**

Run: `npm test`

Expected: 121 testes PASS.

Run: `npm run lint`

Expected: exit code 0.

Run: `npm run build`

Expected: exit code 0.

Run: `git diff --check`

Expected: sem saída e exit code 0.

- [ ] **Step 7: Commit**

```bash
git add src/test/app/App.flow.test.tsx src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx src/features/comunicacao/tela-14-chatbot-balu/Screen.scss
git commit -m "style: reorganiza perguntas rápidas do chatbot"
```
