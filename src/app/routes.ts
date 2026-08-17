const screenPaths = {
  "2": "/onboarding/criar-conta",
  "3": "/onboarding/cadastrar-pet",
  "4": "/onboarding/escolher-experiencia",
  "4t": "/onboarding/experiencia-tradicional",
  "4g": "/onboarding/experiencia-gamificada",
  "5": "/inicio",
  "5a": "/inicio/vermifugo-concluido",
  "5b": "/inicio/passeio-concluido",
  "5t": "/inicio/tradicional",
  "5ta": "/inicio/tradicional/vermifugo-concluido",
  "5tb": "/inicio/tradicional/passeio-concluido",
  "6": "/perfil",
  "6a": "/notificacoes",
  "6b": "/pets/vinculo-clinica",
  "6c": "/perfil/configuracoes",
  "6d": "/perfil/configuracoes/experiencia",
  "6e": "/perfil/configuracoes/alterar-email",
  "6f": "/perfil/configuracoes/alterar-senha",
  "7": "/pets",
  "7a": "/pets/adicionar",
  "7b": "/pets/consultas",
  "8": "/pets/perfil",
  "9": "/pets/rotina",
  "9a": "/pets/rotina/semanal",
  "9b": "/pets/rotina/banho",
  "9c": "/pets/rotina/historico",
  "9d": "/pets/rotina/historico/detalhes",
  "9e": "/pets/rotina/adicionar",
  "10": "/pets/medicamentos",
  "10a": "/pets/medicamentos/proximos",
  "10b": "/pets/medicamentos/hoje",
  "10c": "/pets/medicamentos/historico",
  "10d": "/pets/medicamentos/historico/omega-3",
  "10e": "/pets/medicamentos/historico/prednisolona",
  "10f": "/pets/medicamentos/historico/vermifugo-chemital",
  "10g": "/pets/medicamentos/nexgard",
  "10h": "/pets/medicamentos/adicionar",
  "11": "/pets/carteira",
  "12": "/pets/cuidado-compartilhado",
  "13": "/pets/cuidado-compartilhado/convidar",
  "14": "/chat",
  "15": "/comunidade",
  "15a": "/comunidade/todas",
  "16": "/comunidade/clube-dos-caramelos",
  "16a": "/comunidade/clube-dos-vira-latas",
  "16b": "/comunidade/clube-dos-gateiros",
  "16c": "/comunidade/golden-retriever",
  "16d": "/comunidade/shih-tzu",
  "16e": "/comunidade/poodle",
  "16f": "/comunidade/labrador",
  "16g": "/comunidade/pinscher",
  "16h": "/comunidade/bulldog",
} as const;

const pathsToScreens = Object.fromEntries(
  Object.entries(screenPaths).map(([screen, path]) => [path, screen]),
) as Record<string, string>;

function normalizePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || "/";
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function pathForScreen(screen: string) {
  return screenPaths[screen as keyof typeof screenPaths];
}

export function screenForPath(path: string) {
  return pathsToScreens[normalizePath(path)];
}

export type AppView =
  "login" | "account" | "home" | "pets" | "community" | "chat" | "forgot" | "not-found" | "profile";

const viewPaths: Record<Exclude<AppView, "not-found">, string> = {
  login: "/login",
  account: screenPaths["2"],
  home: screenPaths["5"],
  pets: screenPaths["7"],
  community: screenPaths["15"],
  chat: screenPaths["14"],
  forgot: "/recuperar-senha",
  profile: screenPaths["6"],
};

export function pathForView(view: AppView) {
  return view === "not-found" ? "/pagina-nao-encontrada" : viewPaths[view];
}

export function viewForPath(path: string): AppView {
  const normalized = normalizePath(path);
  if (normalized === "/recuperar-senha") return "forgot";
  if (normalized === "/login" || normalized === "/") return "login";
  if (Object.values(viewPaths).includes(normalized)) {
    return (Object.entries(viewPaths).find(([, path]) => path === normalized)?.[0] ??
      "login") as AppView;
  }
  if (screenForPath(normalized)) return "login";
  return "not-found";
}
