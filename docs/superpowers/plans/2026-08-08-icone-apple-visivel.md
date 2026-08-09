# Ícone da Apple Visível Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o ícone da Apple visível e coerente com a cor azul usada no identificador do Google.

**Architecture:** Manter o SVG compartilhado como fonte única do símbolo e ajustar somente os contêineres visuais existentes. Uma regressão estática verificará a cor do asset e as regras aplicadas nas três superfícies.

**Tech Stack:** React, SCSS, SVG, Vitest.

---

### Task 1: Proteger o novo padrão visual

**Files:**
- Modify: `src/test/app/App.flow.test.tsx`
- Modify: `public/assets/figma/access/apple.svg`
- Modify: `src/features/acesso/tela-01-login/Screen.scss`
- Modify: `src/features/acesso/tela-02-criar-conta/Screen.scss`
- Modify: `src/features/inicio/tela-06c-configuracoes-conta/Screen.scss`

- [ ] **Step 1: Escrever o teste que exige o SVG azul e os círculos claros**

Adicionar um teste que leia os arquivos do projeto e espere `fill="#4285F4"`, além de `background: white` e `border: 1px solid #b2f5ea` nos seletores Apple.

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "mantém o ícone da Apple visível"`

Expected: FAIL porque o SVG ainda usa branco e os círculos ainda têm fundo azul.

- [ ] **Step 3: Aplicar a implementação mínima**

Trocar os preenchimentos do SVG para `#4285F4` e, nos três SCSS, usar fundo branco e borda `#b2f5ea` para o contêiner Apple.

- [ ] **Step 4: Executar o teste focal e confirmar aprovação**

Run: `npm test -- --run src/test/app/App.flow.test.tsx -t "mantém o ícone da Apple visível"`

Expected: PASS.

- [ ] **Step 5: Validar o projeto e criar o commit**

Run: `npm run format && npm run format:check && npm run lint && npm test -- --run && npm run build && git diff --check`

Expected: todos os comandos terminam com código zero e 180 ou mais testes aprovados.

Commit: `fix: melhora contraste do icone Apple`
