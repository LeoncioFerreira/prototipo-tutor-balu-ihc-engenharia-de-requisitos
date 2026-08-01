# Instruções obrigatórias do projeto Balu

Este arquivo é a fonte única de instruções para agentes de IA que trabalham neste repositório. Leia-o integralmente antes de analisar, planejar, responder sobre a implementação ou modificar arquivos.

## 1. Verificação obrigatória da wiki

Antes de qualquer outra ação:

1. Procure a wiki na pasta irmã `../g9.wiki`, sempre resolvendo o caminho a partir da raiz deste repositório.
2. Se ela não estiver nesse local, pergunte ao usuário qual é o caminho da pasta `g9.wiki`.
3. Não analise requisitos, não proponha solução e não modifique arquivos até receber um caminho válido e conseguir ler a wiki.
4. Leia primeiro `home.md` para conhecer o índice.
5. Depois, leia somente os documentos relacionados à tarefa. Consulte especialmente, quando aplicáveis:
   - `USs.md`;
   - `RN.md`;
   - `Requisitos-Não-Funcionais.md`;
   - `Matriz-de-Rastreabilidade-dos-Requisitos.md`;
   - `Matriz-de-Rastreabilidade-entre-Artefatos-de-Software-e-Requisitos.md`;
   - `Diagrama-e-Descrição-dos-Casos-de-Uso.md`;
   - `Diagrama-de-Fluxo-de-Interação.md`;
   - `Protótipos-de-Alta-Fidelidade.md`.

Não é necessário ler todos os uploads, entrevistas ou documentos da wiki em toda tarefa. Leia o índice e os artefatos pertinentes ao requisito em questão.

### Fontes de verdade e conflitos

- A wiki define requisitos, regras de negócio, casos de uso e rastreabilidade.
- O Figma define a referência visual quando o usuário indicar um arquivo ou nó específico.
- O código define apenas o que já está implementado; código existente não cria requisito novo.
- A solicitação explícita do usuário define o escopo da tarefa atual.
- Se solicitação, wiki, Figma e código divergirem, apresente a divergência e peça uma decisão. Não escolha silenciosamente e não invente uma conciliação.

## 2. Regra de escopo: não inventar

- Implemente somente o que foi solicitado e o que estiver sustentado pelos requisitos aplicáveis.
- Não invente telas, rotas, textos, campos, validações, dados, integrações ou comportamentos.
- Não amplie o escopo com refatorações, dependências ou abstrações não necessárias.
- Não altere outras telas para “padronizar” sem autorização.
- Preserve mudanças existentes no diretório de trabalho. Elas podem pertencer a outra pessoa.
- Se faltar uma decisão que mude materialmente o resultado, pergunte antes de implementar.
- Não faça commit, push, merge, publicação ou alteração na wiki sem pedido explícito.

## 3. Visão técnica

O projeto é um protótipo mobile do Balu para tutores de pets.

- React 18 e TypeScript;
- Vite;
- SCSS e Tailwind CSS;
- Vitest, Testing Library e jsdom;
- Lucide React para ícones quando já houver um ícone adequado;
- fonte global `Plus Jakarta Sans`;
- navegação prototipada em `src/app/App.tsx`, usando estado e o parâmetro `?tela=`.

Comandos principais:

```bash
npm run dev
npm test
npm run lint
npm run build
```

## 4. Organização do código

```text
src/
├── app/
│   ├── App.tsx                 # navegação, rotas e composição dos providers
├── components/ui/              # componentes compartilhados entre telas
│   └── error-feedback/         # toast e modal globais de erro
├── features/
│   ├── acesso/                 # autenticação e onboarding
│   ├── inicio/                 # homes, perfil, notificações e configurações
│   ├── pets/                   # perfil, rotina, medicamentos e cuidados do pet
│   ├── comunicacao/            # chatbot
│   └── comunidade/             # comunidades e clube
├── styles/
│   ├── index.css               # fonte, tokens globais e reset
│   └── screens.scss            # agregador dos SCSS das telas/componentes
├── test/
│   ├── setup.ts                # configuração global dos testes
│   ├── app/                    # renderização, rotas e fluxos completos
│   ├── components/             # componentes compartilhados isolados
│   └── features/               # regras isoladas das funcionalidades
└── main.tsx                    # entrada da aplicação
```

### Uma pasta por tela

Cada tela fica em sua própria pasta `src/features/<área>/tela-<id>-<nome>/`.

- `Screen.tsx`: estrutura, estado e comportamento da tela.
- `Screen.scss`: estilos exclusivos da tela.
- Assets reutilizáveis ficam em `public/assets/`; não copie o mesmo asset para várias telas.
- Componentes realmente compartilhados ficam em `src/components/ui/`.
- Ao criar uma tela autorizada, conecte-a explicitamente em `src/app/App.tsx`, importe seu SCSS em `src/styles/screens.scss` e adicione testes de navegação.
- Variações de estado de uma tela usam sufixos no identificador, como `5a`, `5t` e `10c`.

## 5. Mapa atual das telas

O mapa abaixo descreve o que existe no código. Ele não autoriza criar funcionalidades novas.

### Acesso e onboarding

| Identificador | Pasta                                | Responsabilidade e acesso atual                                                                                                             |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | `tela-01-login`                      | Entrada por e-mail e senha; abre recuperação de senha e criação de conta. É a tela inicial, sem `?tela=1`.                                  |
| 1a            | `tela-01a-recuperar-senha`           | Solicitação de recuperação de senha. Aberta pelo estado interno `forgot`, não por parâmetro numerado.                                       |
| 1b            | `tela-01b-provedor-nao-implementado` | Componente visual para provedor social indisponível. Existe no código, mas não está ligado ao roteamento atual; o login usa o modal global. |
| 2             | `tela-02-criar-conta`                | Criação da conta do tutor e etapa 1 do onboarding. Acesso por `?tela=2` ou pelo estado interno `account`.                                   |
| 3             | `tela-03-cadastrar-pet`              | Cadastro inicial do pet, escolha de cuidado compartilhado e etapa 2 do onboarding.                                                          |
| 4             | `tela-04-escolha-experiencia`        | Escolha entre experiência tradicional e gamificada; etapa 3 do onboarding.                                                                  |
| 4t            | `tela-04t-experiencia-tradicional`   | Confirmação da experiência tradicional antes de abrir a home tradicional.                                                                   |
| 4g            | `tela-04g-experiencia-gamificada`    | Tela de experiência gamificada existente e acessível diretamente por `?tela=4g`; não faz parte do avanço padrão após a escolha.             |

### Início, perfil e configurações

| Identificador | Pasta                                  | Responsabilidade e acesso atual                                                                                |
| ------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 5             | `tela-05-home-tutor`                   | Home gamificada do tutor, com progresso, tarefas, pets e atalhos. Também é aberta pelo destino interno `home`. |
| 5a            | `tela-05a-home-vermifugo-concluido`    | Estado da home gamificada após concluir o vermífugo.                                                           |
| 5b            | `tela-05b-home-passeio-concluido`      | Estado da home gamificada após concluir o passeio.                                                             |
| 5t            | `tela-05t-home-tradicional`            | Home sem gamificação, usada quando a preferência salva é `traditional`.                                        |
| 5ta           | `tela-05ta-home-tradicional-vermifugo` | Estado da home tradicional após concluir o vermífugo.                                                          |
| 5tb           | `tela-05tb-home-tradicional-passeio`   | Estado da home tradicional após concluir o passeio.                                                            |
| 6             | `tela-06-perfil-tutor`                 | Perfil do tutor e acesso às configurações da conta.                                                            |
| 6a            | `tela-06a-notificacoes`                | Lista de notificações; pode abrir a solicitação de vínculo da clínica.                                         |
| 6c            | `tela-06c-configuracoes-conta`         | Configurações e exibição da experiência atual.                                                                 |
| 6d            | `tela-06d-escolher-experiencia`        | Alteração da experiência entre tradicional e gamificada.                                                       |

### Pets, rotina, medicamentos e cuidado

| Identificador | Pasta                            | Responsabilidade e acesso atual                                                            |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| 6b            | `tela-06b-vinculo-clinica`       | Solicitação de vínculo do pet com a clínica Unipet.                                        |
| 7             | `tela-07-meus-pets`              | Lista e seleção dos pets; também é aberta pelo destino interno `pets`.                     |
| 7a            | `tela-07a-adicionar-pet`         | Formulário para adicionar outro pet.                                                       |
| 8             | `tela-08-perfil-pet`             | Visão geral do pet Balu e entrada para rotina, remédios, carteira e cuidado compartilhado. |
| 9             | `tela-09-ver-rotina`             | Rotina do pet e seus filtros/abas.                                                         |
| 9a            | `tela-09a-rotina-semanal`        | Estado semanal da rotina.                                                                  |
| 9b            | `tela-09b-rotina-banho`          | Estado de rotina de banho.                                                                 |
| 9c            | `tela-09c-rotina-historico`      | Histórico de rotinas.                                                                      |
| 9d            | `tela-09d-detalhes-historico`    | Detalhes de um registro do histórico da rotina.                                            |
| 9e            | `tela-09e-adicionar-rotina`      | Formulário para adicionar rotina.                                                          |
| 10            | `tela-10-ver-remedios`           | Visão geral dos medicamentos do pet.                                                       |
| 10a           | `tela-10a-remedios-proximos`     | Medicamentos próximos.                                                                     |
| 10b           | `tela-10b-remedios-hoje`         | Medicamentos de hoje.                                                                      |
| 10c           | `tela-10c-historico-remedios`    | Histórico de medicamentos.                                                                 |
| 10d           | `tela-10d-detalhes-omega`        | Detalhes do histórico do Ômega 3.                                                          |
| 10e           | `tela-10e-detalhes-prednisolona` | Detalhes do histórico da Prednisolona.                                                     |
| 10f           | `tela-10f-detalhes-vermifugo`    | Detalhes do histórico do Vermífugo Chemital.                                               |
| 10g           | `tela-10g-detalhes-nexgard`      | Detalhes do NexGard.                                                                       |
| 10h           | `tela-10h-adicionar-remedio`     | Formulário para adicionar remédio.                                                         |
| 11            | `tela-11-ver-carteira`           | Carteira digital do pet.                                                                   |
| 12            | `tela-12-cuidado-compartilhado`  | Cuidadores do pet e histórico de atividades compartilhadas.                                |
| 13            | `tela-13-adicionar-tutor`        | Convite de outro tutor e configuração de permissões.                                       |

### Comunicação e comunidade

| Identificador | Pasta                           | Responsabilidade e acesso atual                                                                           |
| ------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 14            | `tela-14-chatbot-balu`          | Conversa com o chatbot Balu, atalhos e alerta de emergência; também é aberta pelo destino interno `chat`. |
| 15            | `tela-15-comunidades-tematicas` | Lista e busca de comunidades; também é aberta pelo destino interno `community`.                           |
| 16            | `tela-16-clube-caramelos`       | Feed do Clube dos Caramelos.                                                                              |

Ao alterar rotas ou criar uma tela autorizada, atualize esta tabela no mesmo trabalho.

## 6. Navegação compartilhada

- `src/components/ui/MobileShell.tsx` contém a estrutura mobile e a navegação inferior.
- `src/features/inicio/HomeFrame.tsx` compartilha a composição das homes.
- Os destinos principais são `home`, `pets`, `community` e `chat`.
- Não use links ou rotas presumidas: confira `src/app/App.tsx` e os callbacks reais da tela.
- Preserve o retorno correto de telas internas, inclusive quando abertas diretamente por `?tela=`.

## 7. Feedback de erro obrigatório

Existe um único sistema global em `src/components/ui/error-feedback/ErrorFeedback.tsx`, disponibilizado por `ErrorFeedbackProvider` em `App.tsx`. Não crie outro toast, modal, `alert()`, `confirm()` ou mensagem de erro visual paralela.

Há dois tipos:

### Toast: `showToast(message)`

Use para erro breve, recuperável e ligado à ação atual, por exemplo campos obrigatórios ausentes ou opção não selecionada.

- Possui `role="alert"`.
- Fecha automaticamente após quatro segundos ou pelo botão de fechar.
- Após mostrar o toast, direcione o foco ao primeiro campo/controle que precisa de correção quando isso for aplicável.

### Modal: `showModal(options)`

Use quando a ação não pode continuar e o usuário precisa reconhecer a mensagem, por exemplo provedor de login indisponível.

- Exige `title` e `message`.
- Pode receber uma ação opcional `{ label, onClick }`.
- Gerencia foco, fechamento por `Escape` e retorno do foco anterior.
- Não replique sua estrutura dentro de uma tela.

Uso:

```tsx
const { showToast, showModal } = useErrorFeedback();

showToast("Preencha os campos obrigatórios para continuar.");

showModal({
  title: "Ação indisponível",
  message: "Esta ação ainda não está disponível.",
});
```

Escolha entre toast e modal conforme essas regras. Se o requisito não deixar clara a severidade ou a necessidade de confirmação, pergunte ao usuário.

## 8. Design e acessibilidade

- Preserve a fidelidade ao nó do Figma informado pelo usuário, exceto diferenças explicitamente solicitadas.
- Use `Plus Jakarta Sans` e os tokens globais existentes em `src/styles/index.css`.
- Prefira as variáveis `--balu-*` existentes a novas cores soltas quando houver equivalência.
- Reaproveite componentes e assets existentes antes de criar novos.
- Mantenha nomes acessíveis, foco de teclado, semântica, `aria-*` e áreas de toque adequadas.
- Não substitua ícones do design por emoji.
- Não altere textos do produto por iniciativa própria.
- Avalie a tela na largura mobile de referência de 393 px e respeite a exigência de rolagem de cada tarefa.

## 9. Processo obrigatório de implementação

1. Verifique e leia a wiki conforme a seção 1.
2. Inspecione o estado atual do código e do Git antes de editar.
3. Confirme o requisito e limite o escopo.
4. Para funcionalidade ou correção, escreva primeiro um teste que reproduza o comportamento esperado e confirme que ele falha pela razão correta.
5. Faça a menor implementação capaz de atender ao requisito.
6. Execute novamente o teste focal.
7. Revise acessibilidade, navegação e possíveis regressões.
8. Antes de concluir, execute obrigatoriamente:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Não diga que o trabalho está pronto se algum desses comandos falhar. Informe o erro real e corrija-o dentro do escopo.

## 10. Testes

- Todos os testes devem ficar em `src/test/`; não coloque arquivos `*.test.*` junto ao código de produção.
- Testes de fluxo e navegação ficam em `src/test/app/`.
- Testes isolados de componentes ficam em `src/test/components/`.
- Testes de regras de funcionalidades ficam em `src/test/features/`.
- Teste comportamento observável, não detalhes internos de implementação.
- Cubra rota de entrada, ação do usuário, resultado, validações e retorno quando forem afetados.
- Use consultas acessíveis da Testing Library (`getByRole`, `getByLabelText`, `getByText`).
- Não remova ou enfraqueça testes para fazer a suíte passar.

## 11. Git e Conventional Commits

Somente crie commit quando o usuário autorizar. Quando autorizado:

- use mensagem em português, curta e no imperativo;
- inclua somente arquivos pertencentes à tarefa;
- nunca inclua mudanças preexistentes ou documentos não solicitados;
- siga Conventional Commits.

Tipos usuais:

```text
feat: adiciona indicador do onboarding
fix: corrige validação do cadastro do pet
refactor: extrai navegação compartilhada
test: cobre escolha de cuidado compartilhado
docs: documenta mapa das telas
style: ajusta espaçamento da tela de login
chore: atualiza configuração do projeto
```

Antes de qualquer commit, execute as verificações da seção 9 e revise `git diff` e `git status`.

## 12. Encerramento da tarefa

Ao entregar, informe de forma objetiva:

- o que mudou;
- quais arquivos principais foram afetados;
- quais testes e verificações foram executados;
- qualquer limitação ou divergência ainda existente;
- que não houve commit ou publicação, salvo quando isso tiver sido solicitado.
