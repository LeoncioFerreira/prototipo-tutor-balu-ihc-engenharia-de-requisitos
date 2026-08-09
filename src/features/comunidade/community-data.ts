export type Community = {
  id: string;
  screen: string;
  label: string;
  clubTitle: string;
  members: string;
  asset: string;
  author: string;
  initials: string;
  tutorLabel: string;
  headline: string;
  post: string;
  tags: [string, string, string];
  unlocked: boolean;
};

export const communities: Community[] = [
  {
    id: "caramelo",
    screen: "16",
    label: "Caramelo",
    clubTitle: "Clube dos Caramelos",
    members: "2,4 mil membros",
    asset: "breed-caramelo.svg",
    author: "Salomão Rodrigues",
    initials: "SR",
    tutorLabel: "Tutor do Balu",
    headline: "Uma comunidade para trocar dicas, rotina e cuidado com caramelos",
    post: "O Balu soltou muito pelo essa semana e a escova de banho ajudou demais. Quem tem pet com pelagem parecida usa escovação diária ou dia sim, dia não?",
    tags: ["#Caramelos", "#Escovação", "#Passeios"],
    unlocked: true,
  },
  {
    id: "vira-lata",
    screen: "16a",
    label: "Vira-lata",
    clubTitle: "Clube dos Vira-latas",
    members: "3,1 mil membros",
    asset: "breed-mutt.svg",
    author: "André Wesley",
    initials: "AW",
    tutorLabel: "Tutor da Mel",
    headline: "Histórias, cuidados e descobertas de quem ama vira-latas",
    post: "A Mel aprendeu um novo comando durante o passeio. Reforço positivo e petiscos fizeram toda a diferença por aqui.",
    tags: ["#ViraLatas", "#Cuidados", "#Passeios"],
    unlocked: true,
  },
  {
    id: "gateiros",
    screen: "16b",
    label: "Gateiros",
    clubTitle: "Clube dos Gateiros",
    members: "2,8 mil membros",
    asset: "breed-cat.svg",
    author: "Paulo Gabriel",
    initials: "PG",
    tutorLabel: "Tutor do Mingau",
    headline: "Um espaço para compartilhar a rotina e os cuidados dos gatos",
    post: "O Mingau ganhou um cantinho novo perto da janela e já virou o lugar favorito dele para descansar à tarde.",
    tags: ["#Gateiros", "#Cuidados", "#Rotina"],
    unlocked: true,
  },
  ...[
    ["golden", "16c", "Golden Retriever", "1,9 mil membros"],
    ["shih-tzu", "16d", "Shih-tzu", "1,7 mil membros"],
    ["poodle", "16e", "Poodle", "1,5 mil membros"],
    ["labrador", "16f", "Labrador", "1,8 mil membros"],
    ["pinscher", "16g", "Pinscher", "1,3 mil membros"],
    ["bulldog", "16h", "Bulldog", "1,2 mil membros"],
  ].map(([id, screen, label, members]) => ({
    id,
    screen,
    label,
    members,
    clubTitle: `Clube ${label === "Poodle" || label === "Labrador" || label === "Pinscher" || label === "Bulldog" ? "dos" : "do"} ${label}`,
    asset: "breed-mutt.svg",
    author: "Comunidade Balu",
    initials: "CB",
    tutorLabel: "Equipe Balu",
    headline: `Cuidados, rotina e experiências com ${label}`,
    post: `Compartilhe dicas e histórias sobre a rotina do seu ${label}.`,
    tags: [`#${label.replace(/[^a-zA-ZÀ-ÿ]/g, "")}`, "#Cuidados", "#Rotina"] as [
      string,
      string,
      string,
    ],
    unlocked: false,
  })),
];

export const communityById = Object.fromEntries(communities.map((item) => [item.id, item]));
export const communityByScreen = Object.fromEntries(communities.map((item) => [item.screen, item]));
