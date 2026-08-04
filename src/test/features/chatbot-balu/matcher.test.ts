import { describe, expect, test } from "vitest";
import {
  createChatSession,
  type PetChatContext,
} from "../../../features/comunicacao/tela-14-chatbot-balu/matcher";

const balu: PetChatContext = {
  id: "balu",
  name: "Balu",
  species: "Cachorro",
  breed: "Samoieda",
  ageYears: 2,
  weightKg: 22,
  clinic: { name: "Clínica Pet Saúde" },
  vaccines: [
    { name: "Antirrábica", appliedAt: "2026-06-12", nextAt: "2027-06-12" },
    { name: "V10 múltipla", appliedAt: "2026-06-12", nextAt: "2026-07-25" },
  ],
  medications: [
    {
      name: "Vermífugo Chemital",
      schedule: "14:00",
      instructions: "Administrar conforme a prescrição cadastrada.",
    },
    { name: "Prednisolona", schedule: "18:30", instructions: "Dar 5 ml após a refeição." },
    { name: "Ômega 3", schedule: "08:00", instructions: "Administrar 1 cápsula." },
  ],
  routine: [
    { time: "08:00", title: "Alimentação" },
    { time: "18:00", title: "Passeio diário" },
  ],
};

describe("motor conversacional do Balu", () => {
  test.each([
    ["oi", /Oi!.*Balu/i],
    ["bom dia", /Posso ajudar.*vacinas/i],
    ["obrigado", /Por nada/i],
    ["tchau", /Até mais/i],
  ])("reconhece interação básica: %s", (question, expected) => {
    const reply = createChatSession(balu).reply(question);

    expect(reply.kind).toBe("answer");
    expect(reply.text).toMatch(expected);
  });

  test("consulta perfil e clínica do pet", () => {
    const chat = createChatSession(balu);

    expect(chat.reply("quais são os dados do Balu").text).toMatch(/Samoieda.*22 kg/i);
    expect(chat.reply("qual é a clínica do Balu").text).toMatch(/Clínica Pet Saúde/i);
    expect(chat.reply("fale sobre o meu pet que está cadastrado").text).toMatch(
      /Dados cadastrados de Balu/i,
    );
  });

  test("explica a equipe e as disciplinas do projeto", () => {
    const reply = createChatSession(balu).reply("quem criou o Balu e qual disciplina?");

    expect(reply.text).toMatch(/Leôncio.*Paulo.*Salomão.*André/i);
    expect(reply.text).toMatch(
      /Interação Humano-Computador \(IHC\).*Engenharia de Requisitos \(ER\)/i,
    );
    expect(createChatSession(balu).reply("Leôncio").text).toMatch(
      /equipe.*professor Williamson Silva \(Will\)/i,
    );
  });

  test("orienta sobre sintoma sem diagnosticar", () => {
    const reply = createChatSession(balu).reply("o Balu está vomitando");

    expect(reply.kind).toBe("answer");
    expect(reply.text).toMatch(/não faço diagnóstico.*médico-veterinário/i);
  });

  test.each([
    ["me mostra as vacinas", /vacinas de Balu/i],
    ["quais remédios estão cadastrados", /medicamentos de Balu/i],
    ["como está a rotina", /rotina de Balu/i],
    ["qual o peso do Balu", /22 kg/i],
    ["quais cuidados da raça", /orientações gerais/i],
    ["o que ele pode fazer de atividade", /brincadeiras/i],
  ])("mapeia variação de linguagem: %s", (question, expected) => {
    expect(createChatSession(balu).reply(question).text).toMatch(expected);
  });

  test("responde ao atalho de dicas de saúde", () => {
    const reply = createChatSession(balu).reply("dicas de saúde");

    expect(reply.kind).toBe("answer");
    expect(reply.text).toMatch(/vacinas em dia.*água fresca.*peso/i);
  });

  test.each([
    ["estou triste", /triste|conversar|companhia/i],
    ["estou feliz", /sorriso|rotina/i],
    ["estou preocupado", /preocup|calma|veterin/i],
    ["estou cansado", /cansaço|profissional/i],
    ["estou entediado", /passeio|condição/i],
    ["quero conversar", /conversar|companhia|papo/i],
  ])("responde conversa emocional: %s", (question, expected) => {
    expect(createChatSession(balu).reply(question).text).toMatch(expected);
  });

  test("explica suas capacidades", () => {
    const chat = createChatSession(balu);

    const reply = chat.reply("O que você é capaz de fazer?");

    expect(reply.kind).toBe("help");
    expect(reply.text).toMatch(/vacinas, medicamentos e rotina/i);
  });

  test("consulta a última vacina do pet selecionado", () => {
    const chat = createChatSession(balu);

    const reply = chat.reply("qual foi a última vacina do balu?");

    expect(reply.kind).toBe("answer");
    expect(reply.text).toMatch(/Antirrábica.*12\/06\/2026/i);
  });

  test("lista medicamentos e vacinas cadastrados", () => {
    const chat = createChatSession(balu);

    const reply = chat.reply("Faça uma lista dos medicamentos e vacinas do Balu");

    expect(reply.kind).toBe("list");
    expect(reply.text).toMatch(/Vermífugo Chemital.*Antirrábica/s);
  });

  test("pergunta o peso ausente e retoma a orientação", () => {
    const chat = createChatSession({ ...balu, weightKg: undefined });

    expect(chat.reply("O peso do Balu está ideal?").kind).toBe("follow-up");
    const reply = chat.reply("22 kg");

    expect(reply.kind).toBe("answer");
    expect(reply.text).toMatch(/22 kg.*veterin/i);
  });

  test("pede confirmação antes de alertar a clínica em uma emergência digitada", () => {
    const chat = createChatSession(balu);

    const warning = chat.reply("meu cachorro está convulsionando");
    expect(warning.kind).toBe("emergency-confirmation");
    expect(warning.text).toMatch(/deseja alertar.*Clínica Pet Saúde/i);

    const confirmed = chat.reply("sim");
    expect(confirmed.kind).toBe("emergency");
    expect(confirmed.text).toMatch(/alerta simulado.*Clínica Pet Saúde.*afaste objetos/is);
  });

  test("mantém a confirmação até receber sim ou não", () => {
    const chat = createChatSession(balu);

    expect(chat.reply("ele está inconsciente").kind).toBe("emergency-confirmation");
    expect(chat.reply("talvez").kind).toBe("emergency-confirmation");
    expect(chat.reply("sim").kind).toBe("emergency");
  });

  test("não declara alerta enviado quando não existe clínica vinculada", () => {
    const chat = createChatSession({ ...balu, clinic: undefined });
    chat.reply("ele não consegue respirar");

    const reply = chat.reply("sim");

    expect(reply.kind).toBe("emergency");
    expect(reply.text).toMatch(/não há clínica vinculada/i);
    expect(reply.text).not.toMatch(/alerta simulado enviado/i);
  });
});
