# FAQ e ações do chatbot — Design

## Objetivo

Simplificar a barra de ações do chatbot para dois controles lado a lado e transferir Dicas de Saúde e Remédios para o acordeão de perguntas frequentes.

## Barra de ações

- A barra exibirá somente “Perguntas frequentes” e “Acionar Emergência”.
- Os dois botões permanecerão lado a lado em 393 px.
- A largura será adaptável ao conteúdo, reservando um pouco mais de espaço para a ação de emergência.
- “Acionar Emergência” manterá fundo vermelho-claro, borda destacada, ícone de alerta e texto vermelho escuro.
- “Perguntas frequentes” manterá o estilo claro das ações comuns.

## Acordeão de perguntas frequentes

Ao abrir “Perguntas frequentes”, o painel abaixo da barra exibirá cinco itens:

1. Como registrar uma rotina?
2. Como consultar a carteira do pet?
3. Como gerenciar vínculos?
4. Dicas de Saúde
5. Remédios

Os três primeiros itens preservarão os textos atuais. “Dicas de Saúde” exibirá as orientações preventivas já utilizadas pelo chatbot. “Remédios” exibirá diretamente nome, horário e instruções dos medicamentos cadastrados em `demoPets[0].medications`, sem duplicar os dados manualmente na tela.

## Comportamento e dados

- O botão de FAQ continuará alternando `faqOpen` e preservará `aria-expanded` e `aria-controls`.
- Dicas de Saúde e Remédios deixarão de enviar mensagens ao chat e não aparecerão como botões independentes.
- A lista de remédios será renderizada a partir da mesma fonte de dados usada pelo motor conversacional.
- A ação de emergência continuará enviando “emergência” para `sendMessage` e iniciando o fluxo de confirmação existente.
- O campo de mensagem e o botão de envio não serão alterados.

## Acessibilidade

- A barra terá nome acessível “Ações rápidas”.
- O painel de perguntas frequentes continuará identificado por `chatbot-faq`.
- Cada conteúdo usará `details` e `summary`, permitindo operação por teclado.
- A lista de medicamentos usará marcação de lista para leitura adequada por tecnologias assistivas.
- Os dois botões manterão área de toque mínima adequada para mobile.

## Escopo técnico

- `Screen.tsx`: reduzir a barra a dois botões e adicionar os dois itens ao acordeão usando `demoPets[0].medications`.
- `Screen.scss`: criar a divisão adaptável lado a lado e estilizar a lista de medicamentos dentro do acordeão.
- `App.flow.test.tsx`: verificar a barra, a ausência dos antigos botões e o conteúdo dos novos itens.
- Nenhuma alteração no matcher, nas rotas, nos dados demonstrativos ou em outras telas.

## Validação

- Teste confirmando somente dois botões no grupo “Ações rápidas”.
- Teste confirmando que Dicas de Saúde e Remédios são itens do acordeão, não botões.
- Teste confirmando a exibição de Vermífugo Chemital, Prednisolona e Ômega 3 no item Remédios.
- Preservação do teste do fluxo de emergência.
- Execução de `npm test`, `npm run lint`, `npm run build` e `git diff --check`.
