# Ícone da Apple visível

## Objetivo

Corrigir o baixo contraste do ícone branco da Apple e alinhá-lo visualmente ao identificador do Google.

## Design aprovado

- Exibir o símbolo da Apple em azul `#4285f4`.
- Usar fundo branco e borda verde-clara no círculo do provedor, seguindo o tratamento do Google.
- Aplicar o padrão no login, no cadastro de conta e nas configurações de conta.
- Preservar textos, ações, dimensões, nomes acessíveis e comportamento dos provedores.

## Implementação

O SVG compartilhado da Apple passará a usar o azul aprovado. As classes dos círculos da Apple deixarão de usar fundo azul e receberão a mesma borda clara do Google.

## Testes

- Criar uma regressão que confirme a cor azul no SVG.
- Confirmar por teste que os contêineres da Apple usam o novo tratamento visual.
- Executar formatação, lint, suíte completa e build antes do envio à `main`.
