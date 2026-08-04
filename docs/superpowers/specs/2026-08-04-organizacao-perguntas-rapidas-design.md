# Organização das perguntas rápidas — Design

## Objetivo

Melhorar a hierarquia e o agrupamento dos quatro controles rápidos do chatbot, distinguindo claramente as sugestões comuns da ação crítica de emergência.

## Estrutura visual

- A seção de sugestões comuns terá o título “Perguntas rápidas”.
- “Perguntas frequentes” ocupará toda a primeira linha do grupo.
- “Dicas de Saúde” e “Remédios” ficarão lado a lado na segunda linha.
- “Acionar Emergência” ficará fora do grupo de perguntas rápidas, abaixo dele e ocupando toda a largura disponível.
- Nenhum desses controles dependerá de rolagem horizontal.

## Hierarquia visual

- Os três controles comuns usarão o estilo claro já adotado pelo chatbot.
- A ação de emergência terá ícone de alerta, fundo vermelho-claro, borda mais evidente e texto vermelho escuro.
- Espaçamentos, raios e áreas de toque permanecerão consistentes com os controles mobile do protótipo.
- O destaque da emergência não alterará o alerta informativo exibido acima dos controles.

## Comportamento

- “Perguntas frequentes” continuará alternando o acordeão existente e preservará `aria-expanded` e `aria-controls`.
- “Dicas de Saúde” continuará enviando “dicas de saúde” ao motor conversacional.
- “Remédios” continuará enviando “remédio” ao motor conversacional.
- “Acionar Emergência” continuará enviando “emergência” e iniciando o fluxo de confirmação existente.
- O acordeão continuará aparecendo abaixo do grupo de perguntas rápidas.

## Componentes e escopo

- `Screen.tsx` receberá a divisão semântica entre o grupo de perguntas rápidas e a ação de emergência.
- `Screen.scss` definirá a primeira linha inteira, a segunda linha em duas colunas e o botão crítico separado.
- `App.flow.test.tsx` verificará a composição observável e os comportamentos existentes.
- Não haverá novos atalhos, novas perguntas, mudanças no motor conversacional ou alterações em outras telas.

## Acessibilidade

- O grupo comum terá nome acessível “Perguntas rápidas”.
- O botão de emergência permanecerá acessível por seu texto e será separado semanticamente do grupo comum.
- Todos os botões manterão área de toque mínima adequada para mobile e funcionamento por teclado.
- A distinção da emergência não dependerá somente da cor: o ícone e o texto identificarão a ação.

## Validação

- Teste estrutural confirmando que o grupo “Perguntas rápidas” contém somente Perguntas frequentes, Dicas de Saúde e Remédios.
- Teste confirmando que “Acionar Emergência” permanece no bloco de controles, fora do grupo comum.
- Preservação dos testes do acordeão, atalhos e fluxo de emergência.
- Inspeção em largura de 393 px quando um navegador de validação estiver disponível.
- Execução de `npm test`, `npm run lint`, `npm run build` e `git diff --check`.
