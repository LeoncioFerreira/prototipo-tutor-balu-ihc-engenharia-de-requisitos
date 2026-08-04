import { expect, test } from "vitest";
import { findChatbotReply } from "../../features/comunicacao/tela-14-chatbot-balu/matcher";

test("retorna resposta para uma pergunta sobre vacina", () => {
  const reply = findChatbotReply("qual vacina o Balu precisa?");

  expect(reply.kind).toBe("list");
  expect(reply.text).toMatch(/Vacinas de Balu/i);
});

test("lista as vacinas cadastradas ao perguntar se o pet tem vacinas", () => {
  const reply = findChatbotReply("Tem vacinas?");

  expect(reply.kind).toBe("list");
  expect(reply.text).toMatch(/Antirrábica.*V10 múltipla/s);
  expect(reply.text).not.toMatch(/não possui vacinas cadastradas/i);
});

test("retorna orientação segura para pergunta desconhecida", () => {
  expect(findChatbotReply("me conte uma piada").kind).toBe("fallback");
});

test("prioriza urgência para sinais de alarme", () => {
  expect(findChatbotReply("meu pet está sem respirar").kind).toBe("urgent");
});
