import type { PetChatContext } from "../features/comunicacao/tela-14-chatbot-balu/matcher";

export const demoPets: PetChatContext[] = [
  {
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
      { time: "14:00", title: "Vermífugo Chemital" },
      { time: "18:00", title: "Passeio diário" },
    ],
  },
  {
    id: "pipoca",
    name: "Pipoca",
    species: "Gato",
    breed: "Sem raça definida",
    ageYears: 2,
    weightKg: 4.2,
    vaccines: [],
    medications: [],
    routine: [{ time: "08:30", title: "Alimentação" }],
  },
];
