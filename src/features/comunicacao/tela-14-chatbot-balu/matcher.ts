import replies from "../../../data/chatbot-responses.json";
import smalltalk from "../../../data/chatbot-smalltalk.json";

export type Vaccine = { name: string; appliedAt: string; nextAt?: string };
export type Medication = { name: string; schedule: string; instructions: string };
export type RoutineItem = { time: string; title: string };

export type PetChatContext = {
  id: string;
  name: string;
  species: string;
  breed: string;
  ageYears?: number;
  weightKg?: number;
  clinic?: { name: string };
  vaccines: Vaccine[];
  medications: Medication[];
  routine: RoutineItem[];
};

export type ChatbotReply = {
  kind:
    | "answer"
    | "fallback"
    | "help"
    | "list"
    | "follow-up"
    | "emergency-confirmation"
    | "emergency"
    | "urgent";
  text: string;
};

type Pending = "weight" | "emergency" | null;

export const normalizeMessage = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stemKeywords = new Set([
  "vacina",
  "vacinacao",
  "medicamento",
  "remedio",
  "imuniza",
  "brinc",
  "vomit",
  "diarre",
  "convuls",
  "desmai",
  "atropel",
  "envenen",
  "prevencao",
  "alimentar",
]);
const includesAny = (text: string, terms: readonly string[]) =>
  terms.some((term) => {
    // Exact entries match whole words; only explicitly listed stems match inside
    // inflected words (e.g. “vacina” in “vacinas”, “vomit” in “vomitando”).
    if (stemKeywords.has(term)) return text.includes(term);
    return new RegExp(`(?:^| )${escapeRegExp(term)}(?: |$)`).test(text);
  });
const includesAnyToken = (text: string, terms: readonly string[]) =>
  terms.some((term) => new RegExp(`(?:^| )${escapeRegExp(term)}(?: |$)`).test(text));
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
const intentKeywords = (id: string) =>
  replies.intents.find((intent) => intent.id === id)?.keywords ?? [];
const renderMessage = (id: keyof typeof replies.messages, values: Record<string, string> = {}) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replace(new RegExp(`{{${key}}}`, "g"), value),
    replies.messages[id],
  );
const smalltalkReply = (intent: string, pet: PetChatContext): ChatbotReply => {
  const options = smalltalk.responses.filter((item) => item.intent === intent);
  const selected = options[pet.name.length % options.length] ?? smalltalk.responses[0];
  return { kind: "answer", text: selected.text.replace(/{{pet}}/g, pet.name) };
};

function helpReply(pet: PetChatContext): ChatbotReply {
  return {
    kind: "help",
    text: renderMessage("help", { pet: pet.name, species: pet.species, breed: pet.breed }),
  };
}

function vaccineReply(text: string, pet: PetChatContext): ChatbotReply {
  if (!pet.vaccines.length)
    return { kind: "answer", text: renderMessage("noVaccines", { pet: pet.name }) };
  const ordered = [...pet.vaccines].sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));
  if (includesAny(text, replies.vaccineDetailKeywords.last)) {
    const vaccine = ordered[0];
    return {
      kind: "answer",
      text: `A última vacina registrada de ${pet.name} foi ${vaccine.name}, aplicada em ${formatDate(vaccine.appliedAt)}.`,
    };
  }
  if (includesAny(text, replies.vaccineDetailKeywords.next)) {
    const upcoming = ordered
      .filter((item) => item.nextAt)
      .sort((a, b) => a.nextAt!.localeCompare(b.nextAt!))[0];
    return upcoming
      ? {
          kind: "answer",
          text: renderMessage("nextVaccine", {
            vaccine: upcoming.name,
            date: formatDate(upcoming.nextAt!),
          }),
        }
      : { kind: "answer", text: renderMessage("noNextVaccine", { pet: pet.name }) };
  }
  return {
    kind: "list",
    text: `Vacinas de ${pet.name}:\n${ordered.map((item) => `• ${item.name} — aplicada em ${formatDate(item.appliedAt)}${item.nextAt ? `; próxima em ${formatDate(item.nextAt)}` : ""}`).join("\n")}`,
  };
}

function medicationReply(pet: PetChatContext): ChatbotReply {
  if (!pet.medications.length)
    return { kind: "answer", text: renderMessage("noMedications", { pet: pet.name }) };
  return {
    kind: "list",
    text: `Medicamentos de ${pet.name}:\n${pet.medications.map((item) => `• ${item.name} — ${item.schedule}. ${item.instructions}`).join("\n")}`,
  };
}

function combinedHealthList(pet: PetChatContext): ChatbotReply {
  const medications = pet.medications.length
    ? pet.medications.map((item) => `• ${item.name} — ${item.schedule}`).join("\n")
    : "• Nenhum medicamento ativo cadastrado";
  const vaccines = pet.vaccines.length
    ? [...pet.vaccines]
        .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt))
        .map((item) => `• ${item.name} — ${formatDate(item.appliedAt)}`)
        .join("\n")
    : "• Nenhuma vacina cadastrada";
  return {
    kind: "list",
    text: `Medicamentos de ${pet.name}:\n${medications}\n\nVacinas de ${pet.name}:\n${vaccines}`,
  };
}

function routineReply(pet: PetChatContext): ChatbotReply {
  return pet.routine.length
    ? {
        kind: "list",
        text: `Rotina de ${pet.name}:\n${pet.routine.map((item) => `• ${item.time} — ${item.title}`).join("\n")}`,
      }
    : { kind: "answer", text: renderMessage("noRoutine", { pet: pet.name }) };
}

function profileReply(pet: PetChatContext): ChatbotReply {
  const age = pet.ageYears === undefined ? "idade não cadastrada" : `${pet.ageYears} anos`;
  const weight = pet.weightKg === undefined ? "peso não cadastrado" : `${pet.weightKg} kg`;
  return {
    kind: "answer",
    text: renderMessage("petProfile", {
      pet: pet.name,
      species: pet.species,
      breed: pet.breed,
      age,
      weight,
    }),
  };
}

function clinicReply(pet: PetChatContext): ChatbotReply {
  return pet.clinic
    ? { kind: "answer", text: renderMessage("clinic", { pet: pet.name, clinic: pet.clinic.name }) }
    : { kind: "answer", text: renderMessage("clinicUnknown", { pet: pet.name }) };
}

function emergencyInstructions(pet: PetChatContext): string {
  const clinicStatus = pet.clinic
    ? renderMessage("emergencyWithClinic", { clinic: pet.clinic.name })
    : replies.messages.emergencyWithoutClinic;
  return `${clinicStatus}\n\n${replies.messages.firstAid}`;
}

export function createChatSession(pet: PetChatContext) {
  let pending: Pending = null;

  return {
    reply(message: string): ChatbotReply {
      const text = normalizeMessage(message);
      if (!text) return { kind: "fallback", text: replies.messages.empty };

      if (pending === "emergency") {
        if (includesAny(text, replies.affirmativeKeywords))
          return { kind: "emergency", text: emergencyInstructions(pet) };
        if (includesAny(text, replies.negativeKeywords)) {
          pending = null;
          return { kind: "answer", text: replies.messages.emergencyCancel };
        }
        return { kind: "emergency-confirmation", text: replies.messages.emergencyClarification };
      }

      if (pending === "weight") {
        pending = null;
        const match = text.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|quilo)?/);
        if (!match)
          return { kind: "follow-up", text: renderMessage("weightInvalid", { pet: pet.name }) };
        const weight = match[1].replace(",", ".");
        return { kind: "answer", text: renderMessage("weightAnswer", { pet: pet.name, weight }) };
      }

      if (includesAny(text, replies.emergencyKeywords)) {
        pending = "emergency";
        const destination = pet.clinic?.name ?? "uma clínica vinculada";
        return {
          kind: "emergency-confirmation",
          text: renderMessage("emergencyConfirmation", { clinic: destination }),
        };
      }

      if (includesAnyToken(text, intentKeywords("saudacao")))
        return { kind: "answer", text: renderMessage("greeting", { pet: pet.name }) };
      if (includesAnyToken(text, intentKeywords("despedida")))
        return { kind: "answer", text: renderMessage("farewell", { pet: pet.name }) };
      if (includesAnyToken(text, intentKeywords("agradecimento")))
        return { kind: "answer", text: renderMessage("thanks", { pet: pet.name }) };
      if (includesAnyToken(text, intentKeywords("bemEstar")))
        return { kind: "answer", text: renderMessage("wellBeing", { pet: pet.name }) };
      if (includesAnyToken(text, intentKeywords("identidade")))
        return { kind: "help", text: renderMessage("identity", { pet: pet.name }) };
      if (includesAny(text, intentKeywords("sobreProjeto")))
        return { kind: "answer", text: replies.messages.projectTeam };
      if (includesAny(text, intentKeywords("sintoma")))
        return { kind: "answer", text: renderMessage("symptom", { pet: pet.name }) };
      for (const intent of [
        "feliz",
        "triste",
        "preocupado",
        "cansado",
        "entediado",
        "empolgado",
        "conversa",
      ]) {
        if (includesAny(text, intentKeywords(intent))) return smalltalkReply(intent, pet);
      }
      if (includesAnyToken(text, intentKeywords("positivo")))
        return { kind: "answer", text: renderMessage("positive", { pet: pet.name }) };
      if (includesAnyToken(text, intentKeywords("negativo")))
        return { kind: "answer", text: renderMessage("negative", { pet: pet.name }) };
      if (includesAny(text, intentKeywords("clinica"))) return clinicReply(pet);
      if (includesAny(text, intentKeywords("consulta")))
        return { kind: "answer", text: renderMessage("appointment", { pet: pet.name }) };
      if (includesAny(text, intentKeywords("perfilPet"))) return profileReply(pet);
      if (includesAny(text, intentKeywords("idade")))
        return pet.ageYears === undefined
          ? { kind: "answer", text: renderMessage("ageUnknown", { pet: pet.name }) }
          : { kind: "answer", text: `${pet.name} tem ${pet.ageYears} anos.` };
      if (includesAny(text, intentKeywords("raca")))
        return pet.breed === "não informada"
          ? { kind: "answer", text: renderMessage("breedUnknown", { pet: pet.name }) }
          : { kind: "answer", text: `${pet.name} é da raça ${pet.breed}.` };

      const asksVaccines = includesAny(text, intentKeywords("vacina"));
      const asksMedication = includesAny(text, intentKeywords("medicamento"));
      if (asksVaccines && asksMedication) return combinedHealthList(pet);
      if (asksVaccines) return vaccineReply(text, pet);
      if (asksMedication) return medicationReply(pet);
      if (includesAny(text, intentKeywords("alimentacao")))
        return { kind: "answer", text: renderMessage("feeding", { pet: pet.name }) };
      if (includesAny(text, intentKeywords("rotina"))) return routineReply(pet);
      if (includesAny(text, intentKeywords("peso"))) {
        if (pet.weightKg === undefined) {
          pending = "weight";
          return { kind: "follow-up", text: renderMessage("weightQuestion", { pet: pet.name }) };
        }
        return {
          kind: "answer",
          text: `${pet.name} está com ${pet.weightKg} kg. O peso ideal depende de porte, idade e condição corporal; confirme a avaliação com um médico-veterinário.`,
        };
      }
      if (includesAny(text, intentKeywords("ajuda"))) return helpReply(pet);
      if (includesAny(text, intentKeywords("atividade")))
        return {
          kind: "answer",
          text: renderMessage("activity", { pet: pet.name, breed: pet.breed }),
        };
      if (includesAny(text, intentKeywords("dicasSaude")))
        return { kind: "answer", text: renderMessage("healthTips", { pet: pet.name }) };
      if (includesAny(text, intentKeywords("cuidados")))
        return {
          kind: "answer",
          text: renderMessage("breedCare", {
            pet: pet.name,
            species: pet.species,
            breed: pet.breed,
          }),
        };

      return { kind: "fallback", text: renderMessage("fallback", { pet: pet.name }) };
    },
  };
}

const legacyPet: PetChatContext = {
  id: "pet",
  name: "seu pet",
  species: "pet",
  breed: "não informada",
  vaccines: [],
  medications: [],
  routine: [],
};
export function findChatbotReply(question: string): ChatbotReply {
  const reply = createChatSession(legacyPet).reply(question);
  return reply.kind === "emergency-confirmation" ? { ...reply, kind: "urgent" } : reply;
}
