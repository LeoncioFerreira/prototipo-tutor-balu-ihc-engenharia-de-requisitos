import { expect, test } from "vitest";
import { findChatbotReply } from "./matcher";

test("retorna resposta para uma pergunta sobre vacina", () => {
  expect(findChatbotReply("qual vacina o Balu precisa?").kind).toBe("answer");
});

test("retorna orientação segura para pergunta desconhecida", () => {
  expect(findChatbotReply("me conte uma piada").kind).toBe("fallback");
});

test("prioriza urgência para sinais de alarme", () => {
  expect(findChatbotReply("meu pet está sem respirar").kind).toBe("urgent");
});
