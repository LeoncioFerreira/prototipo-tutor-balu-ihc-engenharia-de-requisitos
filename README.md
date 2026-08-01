# Balu — aplicativo mobile do tutor

Protótipo mobile do Balu para acompanhamento preventivo de pets. A aplicação reúne autenticação, cadastro do pet, rotinas, medicamentos, carteira digital, cuidado compartilhado, comunidade e chatbot.

## Requisitos

- Node.js 22;
- npm;
- a wiki `g9.wiki` disponível ao lado da pasta do projeto ou em um caminho informado à IA.

## Instalação e execução

```bash
npm ci
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação.

## Comandos do projeto

```bash
npm run dev          # inicia o ambiente de desenvolvimento
npm run format       # formata os arquivos acompanhados pelo projeto
npm run format:check # verifica a formatação sem modificar arquivos
npm run lint         # executa o ESLint
npm test             # executa os testes com Vitest
npm run build        # gera a aplicação de produção em dist/
```

Antes de enviar qualquer alteração, execute:

```bash
npm run format:check
npm run lint
npm test
npm run build
git diff --check
```

## Instruções obrigatórias para IAs

- Codex deve ler integralmente [`AGENTS.md`](./AGENTS.md) antes de iniciar qualquer tarefa.
- Gemini e Antigravity devem ler [`GEMINI.md`](./GEMINI.md), que carrega e torna obrigatório o conteúdo de `AGENTS.md`.
- A primeira ação da IA é localizar e consultar a wiki `g9.wiki` conforme as regras de `AGENTS.md`.
- Se a wiki não estiver em `../g9.wiki`, a IA deve pedir ao usuário o caminho correto e parar até conseguir acessá-la.
- A IA não pode inventar requisito, tela, texto, rota ou comportamento.

## Organização do projeto

Cada tela ocupa uma pasta própria:

```text
src/features/<area>/tela-<id>-<nome>/
├── Screen.tsx
└── Screen.scss
```

- `src/app/App.tsx`: navegação e composição das telas;
- `src/components/ui/`: componentes compartilhados;
- `src/features/`: telas separadas por domínio;
- `src/styles/`: fonte, tokens globais e agregação dos estilos;
- `public/assets/`: fontes, imagens e ícones;
- `src/test/`: configuração e todos os testes automatizados.

O mapa completo das telas e suas responsabilidades está em `AGENTS.md`.

## Testes

Todos os testes ficam centralizados em `src/test/`:

```text
src/test/
├── setup.ts
├── app/
│   ├── App.test.tsx
│   └── App.flow.test.tsx
├── components/
│   └── ErrorFeedback.test.tsx
└── features/
    └── chatbot-matcher.test.ts
```

- `app/`: renderização geral, rotas e fluxos completos do usuário;
- `components/`: comportamento isolado dos componentes compartilhados;
- `features/`: regras isoladas de uma funcionalidade;
- `setup.ts`: configuração global do Vitest e limpeza entre testes.

Toda funcionalidade ou correção deve começar com um teste que falhe pela razão esperada. Depois da implementação, execute primeiro o teste focal e, antes do push, toda a suíte com `npm test`. Teste comportamentos observáveis com consultas acessíveis da Testing Library e nunca remova ou enfraqueça um teste apenas para fazer o CI passar.

## Fluxo de Git

Por padrão, cada correção ou funcionalidade deve começar em uma branch própria antes da primeira alteração. Só trabalhe diretamente na `main` quando houver autorização explícita.

Formato:

```text
tipo/descricao-responsavel
```

Exemplo:

```text
refactor/correcoes-leoncio
```

Tipos usuais:

- `feat`: funcionalidade;
- `fix`: correção;
- `refactor`: reorganização sem mudança de comportamento;
- `test`: testes;
- `docs`: documentação;
- `chore`: infraestrutura e manutenção.

Os commits seguem Conventional Commits:

```text
feat: adiciona nova funcionalidade
fix: corrige comportamento da tela
refactor: reorganiza componente compartilhado
test: cobre fluxo de cadastro
docs: atualiza instruções da equipe
chore: configura integração contínua
```

Não faça commit, push, merge ou publicação sem autorização explícita.

## CI/CD e Vercel

O workflow em `.github/workflows/ci.yml` roda em pushes e pull requests para a `main` e verifica:

1. formatação;
2. lint;
3. testes;
4. build de produção.

O deploy usa a integração Git nativa da Vercel:

- pull requests e outras branches podem gerar previews;
- a `main` é a branch de produção;
- a configuração de build está em `vercel.json`;
- nenhum token da Vercel é armazenado no workflow.

Para ativar o deploy, importe o repositório na Vercel, confirme o framework **Vite** e selecione `main` como Production Branch. A Vercel usará `npm ci`, `npm run build` e publicará a pasta `dist`.
