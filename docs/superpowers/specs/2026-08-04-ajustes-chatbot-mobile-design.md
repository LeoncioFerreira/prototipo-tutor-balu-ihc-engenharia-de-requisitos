# Ajustes do chatbot mobile — Design

## Objetivo

Corrigir a resposta visível à pergunta digitada “Tem vacinas?” e reorganizar os controles do chatbot para que perguntas frequentes, atalhos, campo de mensagem e botão de envio permaneçam legíveis e acessíveis na largura mobile de 393 px.

## Escopo funcional

- A pergunta digitada “Tem vacinas?” deve produzir uma mensagem do chatbot com as vacinas cadastradas do Balu, incluindo Antirrábica e V10 múltipla.
- Não será criado um atalho de vacinas.
- Os quatro atalhos existentes serão preservados: Perguntas frequentes, Acionar Emergência, Dicas de Saúde e Remédios.
- Perguntas frequentes continuarão abrindo na própria tela e serão apresentadas como um acordeão.

## Layout dos controles

- Os quatro atalhos serão organizados em uma grade responsiva de duas colunas.
- Nenhum botão poderá ultrapassar a largura do contêiner ou depender de rolagem horizontal.
- O botão de emergência manterá sua diferenciação visual.
- O acordeão aparecerá entre os atalhos e o campo de mensagem, usando cartões separados, títulos legíveis e indicador visual nativo de expansão.
- A área de controles poderá rolar verticalmente quando o acordeão aberto não couber no espaço disponível, sem retirar a navegação inferior da tela.

## Campo de mensagem

- O campo reservará espaço interno para o botão de envio.
- O botão ficará ancorado à direita, centralizado verticalmente na altura mínima do campo e sempre dentro dos limites do contêiner.
- A área de toque do envio terá no mínimo 44 × 44 px.
- O comportamento atual de Enter para enviar e Control+Enter para nova linha será preservado.

## Acessibilidade

- Os botões manterão nomes acessíveis existentes.
- O acionador das perguntas frequentes informará o estado aberto ou fechado com `aria-expanded` e apontará para o painel com `aria-controls`.
- O acordeão usará `details` e `summary`, preservando operação por teclado.
- Foco, contraste e áreas de toque seguirão os padrões já usados pelo protótipo.

## Validação

- Teste de fluxo enviando “Tem vacinas?” pela interface e verificando Antirrábica e V10 múltipla.
- Teste do estado acessível do botão de perguntas frequentes e do conteúdo do acordeão.
- Teste estrutural garantindo que os quatro atalhos e o envio permaneçam no bloco de controles.
- Inspeção visual na largura de 393 px.
- Execução de `npm test`, `npm run lint`, `npm run build` e `git diff --check`.

## Fora do escopo

- Integração com serviço externo de IA.
- Inclusão de novos atalhos ou novas perguntas frequentes.
- Alterações em outras telas ou na navegação principal.
