# FAQ e Ações do Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Manter somente FAQ e emergência lado a lado e mover Dicas de Saúde e Remédios para o acordeão.

**Architecture:** A tela continuará usando `demoPets[0]` como fonte única dos medicamentos. A alteração ficará na composição JSX, no SCSS local e no teste de fluxo observável, sem mudar o motor conversacional.

**Tech Stack:** React 18, TypeScript, SCSS, Vitest, Testing Library e jsdom.

## Global Constraints

- A barra exibirá somente “Perguntas frequentes” e “Acionar Emergência”.
- Os dois botões permanecerão lado a lado em 393 px.
- Dicas de Saúde e Remédios serão itens de acordeão.
- Remédios exibirá dados de `demoPets[0].medications`.
- O fluxo de emergência e o campo de mensagem serão preservados.
- Nenhuma outra tela ou o matcher será alterado.

---

### Task 1: Transformar Dicas e Remédios em itens do FAQ

**Files:**
- Modify: `src/test/app/App.flow.test.tsx`
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx`
- Modify: `src/features/comunicacao/tela-14-chatbot-balu/Screen.scss`

**Interfaces:**
- Consumes: `demoPets[0].medications`, `faqOpen`, `sendMessage("emergência")`.
- Produces: grupo acessível `Ações rápidas` com dois botões e acordeão com cinco itens.

- [ ] **Step 1: Escrever o teste que descreve a nova composição**

Atualizar os testes de chatbot em `App.flow.test.tsx`:

```tsx
const actions = within(controls).getByRole("group", { name: "Ações rápidas" });
expect(within(actions).getAllByRole("button")).toHaveLength(2);
expect(actions).toContainElement(screen.getByRole("button", { name: "Perguntas frequentes" }));
expect(actions).toContainElement(screen.getByRole("button", { name: "Acionar Emergência" }));
expect(screen.queryByRole("button", { name: "Dicas de Saúde" })).not.toBeInTheDocument();
expect(screen.queryByRole("button", { name: "Remédios" })).not.toBeInTheDocument();
```

Após abrir FAQ:

```tsx
expect(screen.getByText("Dicas de Saúde", { selector: "summary" })).toBeInTheDocument();
await user.click(screen.getByText("Remédios", { selector: "summary" }));
expect(screen.getByText(/Vermífugo Chemital.*14:00/s)).toBeInTheDocument();
expect(screen.getByText(/Prednisolona.*18:30/s)).toBeInTheDocument();
expect(screen.getByText(/Ômega 3.*08:00/s)).toBeInTheDocument();
```

- [ ] **Step 2: Executar os testes e confirmar a falha correta**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "mantém alerta, atalhos|oferece ajuda contextual"`

Expected: FAIL porque o grupo ainda se chama “Perguntas rápidas” e Dicas/Remédios ainda são botões.

- [ ] **Step 3: Implementar os dois botões lado a lado**

Em `Screen.tsx`, substituir `chatbot-screen__quick-actions` e o botão de emergência separado por:

```tsx
<div className="chatbot-screen__actions" role="group" aria-label="Ações rápidas">
  <button type="button" aria-expanded={faqOpen} aria-controls="chatbot-faq">
    Perguntas frequentes
  </button>
  <button type="button" className="chatbot-screen__emergency-action">
    <TriangleAlert aria-hidden="true" size={18} strokeWidth={2.25} />
    Acionar Emergência
  </button>
</div>
```

Preservar os callbacks existentes nos dois botões.

- [ ] **Step 4: Adicionar Dicas de Saúde e Remédios ao acordeão**

Adicionar ao painel `chatbot-faq`:

```tsx
<details>
  <summary>Dicas de Saúde</summary>
  <p>Mantenha as vacinas em dia, ofereça água fresca, acompanhe o peso, mantenha uma rotina de alimentação e passeios e observe mudanças de comportamento. Em caso de sinais preocupantes, procure um médico-veterinário.</p>
</details>
<details>
  <summary>Remédios</summary>
  <ul className="chatbot-screen__medications">
    {demoPets[0].medications.map((medication) => (
      <li key={medication.name}>
        <strong>{medication.name}</strong>
        <span>{medication.schedule} — {medication.instructions}</span>
      </li>
    ))}
  </ul>
</details>
```

- [ ] **Step 5: Ajustar o SCSS da barra e da lista**

Substituir os estilos de `quick-actions` e `chips` por:

```scss
&__actions {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 8px;

  > button {
    width: 100%;
    min-height: 44px;
    border-radius: 12px;
    padding: 8px;
    font-size: 10px;
    font-weight: 700;
  }
}
```

Manter a aparência crítica em `.chatbot-screen__emergency-action`, removendo sua largura e margens globais redundantes. Adicionar:

```scss
&__medications {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 10px 12px 12px 28px;
  color: #4a5568;
  font-size: 10px;

  li,
  span {
    display: grid;
    gap: 2px;
  }
}
```

- [ ] **Step 6: Executar testes focais**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "chat|assistente virtual|mantém alerta, atalhos"`

Expected: todos os testes selecionados PASS.

- [ ] **Step 7: Executar verificações completas**

Run: `npm test`

Expected: 121 testes PASS.

Run: `npm run lint`

Expected: exit code 0.

Run: `npm run build`

Expected: exit code 0.

Run: `git diff --check`

Expected: sem saída e exit code 0.

- [ ] **Step 8: Commit**

```bash
git add src/test/app/App.flow.test.tsx src/features/comunicacao/tela-14-chatbot-balu/Screen.tsx src/features/comunicacao/tela-14-chatbot-balu/Screen.scss
git commit -m "style: simplifica ações rápidas do chatbot"
```
