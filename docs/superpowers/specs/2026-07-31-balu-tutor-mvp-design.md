# Balu Tutor — MVP mobile-first

## Objetivo

Construir um protótipo funcional navegável para apresentação da disciplina de IHC. A aplicação reproduz as telas do Figma do perfil Tutor e demonstra os fluxos essenciais sem backend ou autenticação real.

## Escopo

O MVP contempla: entrada e cadastro, escolha de experiência, início com rotina e lembretes, notificações, seleção e perfil de pets, cuidado compartilhado, carteira de saúde e medicamentos, vínculo com clínica, chatbot Balu, comunidades e perfil do tutor.

Os dados são demonstrativos e ficam no cliente. A aplicação não envia mensagens, cria contas reais, integra clínicas, usa notificações do sistema ou fornece orientação veterinária individualizada.

## Stack

- React 18, TypeScript e Vite;
- Tailwind CSS 4 para tokens, responsividade e estados;
- React Router para navegação;
- Lucide React somente para ícones que correspondam ao desenho; os demais elementos visuais serão assets exportados do Figma;
- Vitest e Testing Library para a lógica do chatbot e fluxos críticos.

Não será adotada uma biblioteca de componentes com aparência pronta, como shadcn/ui ou MUI. Os componentes Balu serão próprios para preservar métricas, espaçamentos, cores e estados do Figma.

## Estrutura

```text
src/
  app/             rotas, shell e providers
  components/      Button, Card, BottomNav, PetHeader, StatusTag, TaskItem e ChatBubble
  features/        auth, home, pets, health, notifications, chatbot, community e profile
  data/            conteúdo demonstrativo e chatbot-responses.json
  lib/             correspondência de intenção e utilitários
  styles/          tokens e estilos globais
```

## Navegação e estado

As rotas representam cada área do Figma. A barra inferior mantém acesso a Início, Pets, Comunidade e Chat. Telas internas possuem retorno consistente.

O estado do MVP fica em memória e em `localStorage` quando fizer sentido para a demonstração. Concluir ou adiar um lembrete atualiza cards e notificações; trocar de pet atualiza os cabeçalhos; registrar rotina inclui um item local; uma publicação nova aparece no clube atual.

## Chatbot

`chatbot-responses.json` conterá intenções, palavras-chave, sugestões e respostas. A busca normaliza maiúsculas, acentos e espaços, avalia as palavras-chave e seleciona a resposta de maior correspondência. Se não houver intenção compatível, apresenta uma resposta segura orientando a procurar uma clínica ou médico-veterinário.

O chat nunca se apresenta como diagnóstico ou prescrição. A resposta de contingência também sinaliza urgência quando a pergunta mencionar sinais de alarme definidos no JSON.

## Fidelidade visual

A referência é a captura integral das telas de Tutor no Figma em 31 de julho de 2026. O layout é mobile-first e usa a largura de referência do design como base; em telas largas, o conteúdo permanece em uma moldura móvel centralizada, sem transformar o app em dashboard desktop.

Serão criados tokens de cor, tipografia, raio, sombra e espaçamento a partir do Figma. Cada tela será revisada contra a captura; imagens e ícones exclusivos serão exportados como assets, sem redesenho manual.

## Falhas e acessibilidade

Campos obrigatórios terão erro visível. Botões terão estados de foco e rótulos acessíveis. A interface preservará contraste, tamanho mínimo de toque e fluxo por teclado. Estados não suportados pelo MVP terão mensagem clara em vez de simular integração real.

## Testes e aceite

- A função de intenção retorna a resposta correta para uma pergunta conhecida;
- Perguntas desconhecidas acionam a resposta segura;
- Sinais de alarme recebem orientação de urgência;
- Ações de concluir e adiar alteram o lembrete na tela;
- As rotas principais podem ser acessadas a partir da navegação móvel;
- `npm run build` conclui sem erros.

## Critérios de entrega

O repositório terá README com instalação e execução, pasta `requisitos/` para material da disciplina, testes executáveis e uma aplicação que percorre todos os caminhos representados na referência de Figma.
