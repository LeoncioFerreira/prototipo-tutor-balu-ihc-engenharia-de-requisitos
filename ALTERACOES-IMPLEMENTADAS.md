# Alterações implementadas no protótipo Balu

Este documento consolida as funcionalidades, correções e ajustes visuais realizados nesta sequência de trabalho na branch `main`.

## Comunidade

- Adição dos ícones e ações de curtir e comentar nas publicações.
- Exibição e recolhimento da área de comentários.
- Comentários demonstrativos em todos os clubes.
- Comentários com avatar, autor, conteúdo e quantidade de curtidas.
- Possibilidade de curtir comentários e responder a comentários.
- Respostas limitadas a um nível de profundidade.
- Publicação de novos comentários identificados pelo tutor.
- Interação também disponível nas publicações criadas durante a sessão.
- Criação de publicação com seleção de várias tags.
- Possibilidade de criar uma nova tag.
- Tags opcionais: uma publicação pode ser criada sem tag.
- Filtros do clube permitem deixar todas as tags desmarcadas.
- Imagem opcional na publicação, escolhida da galeria ou capturada pela câmera.
- Ajustes de posicionamento do seletor de imagem e do botão flutuante de nova publicação.

## Pets e perfil

- Estado compartilhado do perfil do Balu durante a sessão.
- Atualização da foto do pet pela galeria ou câmera.
- Foto atualizada refletida no perfil e na carteira.
- Botão de foto reduzido e reposicionado sobre o avatar.
- Edição do pet reutilizando o formulário de cadastro com dados preenchidos.
- Campos editáveis: nome, raça, sexo, nascimento aproximado e pelagem.
- Ações “Editar” e “Excluir” organizadas abaixo de “Ver perfil” e “Consultas”.
- Exclusão remove o pet da lista, com confirmação e aviso de preservação do prontuário clínico.
- Estado vazio exibido quando não há pet na lista.

## Rotinas

- Ações para editar e remover rotinas cadastradas pelo tutor.
- Confirmação antes da remoção.
- Detalhes das rotinas semanal e de banho.
- Tela de detalhes do histórico da rotina.
- Correção do histórico: cada registro agora abre sua própria data, quantidade de cuidados e atividades.
- Retorno da tela de detalhes para o histórico.

## Medicamentos

- Identificação da origem do medicamento: cadastrado pelo tutor ou pela clínica.
- Medicamentos do tutor podem ser editados e removidos.
- Medicamentos da clínica permanecem protegidos contra edição e remoção.
- Legenda de segurança explicando a proteção dos medicamentos cadastrados pela clínica.
- Remoção do avatar decorativo dos cartões de medicamentos para seguir o padrão visual das rotinas.
- Conteúdo, status e ações dos cartões de medicamentos alinhados ao padrão das rotinas.
- Detalhes dos medicamentos e navegação preservada entre as abas.

## Carteira de saúde

- Remoção da aba “Docs”.
- Abas de vacinas, consultas e exames centralizadas.
- Detalhes individuais das vacinas Antirrábica e V10 múltipla.
- Aviso de que o Balu não substitui o registro oficial de vacinação.
- Detalhes da consulta preventiva com data, veterinária e resumo.
- Detalhes do Hemograma Completo.
- Visualização de laudo demonstrativo do exame.

## Consultas

- Filtros para todas, concluídas e canceladas.
- Confirmação de presença na próxima consulta.
- Reagendamento de consulta.
- Cancelamento com motivo obrigatório.
- Detalhes da próxima consulta em modal.
- Botão “Marcar consulta” mantido no final do conteúdo, sem acompanhar a rolagem.

## Componentes e padrão visual

- Cabeçalho compartilhado entre perfil e carteira.
- Títulos mantidos à esquerda, depois da seta de voltar.
- Tipografia dos títulos padronizada com Plus Jakarta Sans, 20 px, peso 700 e azul Balu.
- Cabeçalhos internos de rotina, medicamentos e cuidado compartilhado corrigidos para o mesmo padrão tipográfico.
- Criação do componente compartilhado `PetDetailsButton`.
- Todos os “Ver detalhes” das telas de pets usam o mesmo formato: fundo branco, borda clara, cantos arredondados e texto discreto.
- O componente preserva semântica de botão, link ou indicador conforme o contexto.
- Espaçamento superior original do `MobileShell` preservado em 44 px.
- Símbolo `+` centralizado nos botões circulares e ajustado no seletor da foto.

## Testes e qualidade

- Cobertura dos fluxos de comunidade, cadastro, edição e exclusão do pet.
- Cobertura da foto compartilhada entre telas.
- Cobertura dos detalhes de vacinas, consultas, exames e histórico da rotina.
- Cobertura do componente e padrão visual de “Ver detalhes”.
- Verificações utilizadas durante o trabalho: testes Vitest, ESLint, build de produção e `git diff --check`.

## Observações

- Os dados apresentados continuam demonstrativos e mantidos somente durante a sessão do protótipo.
- Nenhuma integração externa ou persistência em servidor foi adicionada.
- A wiki não recebeu alterações durante a implementação.
