import { useState, type ComponentType } from "react";
import {
  ArrowLeft,
  Bell,
  Bot,
  ChevronRight,
  CircleHelp,
  Heart,
  Home,
  MessageCircle,
  PawPrint,
  Plus,
  Search,
  Send,
  Stethoscope,
  Users,
} from "lucide-react";
import { LoginScreen } from "../features/acesso/tela-01-login/Screen";
import { CreateAccountScreen } from "../features/acesso/tela-02-criar-conta/Screen";
import { RegisterPetScreen } from "../features/acesso/tela-03-cadastrar-pet/Screen";
import { ExperienceScreen } from "../features/acesso/tela-04-escolha-experiencia/Screen";
import { InformationScreen } from "../components/ui/InformationScreen";
import { HomeTutorScreen } from "../features/inicio/tela-05-home-tutor/Screen";
import { HomeMedicineDoneScreen } from "../features/inicio/tela-05a-home-vermifugo-concluido/Screen";
import { HomeWalkDoneScreen } from "../features/inicio/tela-05b-home-passeio-concluido/Screen";
import { TraditionalHomeScreen } from "../features/inicio/tela-05t-home-tradicional/Screen";
import { TraditionalHomeMedicineScreen } from "../features/inicio/tela-05ta-home-tradicional-vermifugo/Screen";
import { TraditionalHomeWalkScreen } from "../features/inicio/tela-05tb-home-tradicional-passeio/Screen";
import { TutorProfileScreen } from "../features/inicio/tela-06-perfil-tutor/Screen";
import { NotificationsScreen } from "../features/inicio/tela-06a-notificacoes/Screen";
import { ClinicLinkScreen } from "../features/pets/tela-06b-vinculo-clinica/Screen";
import { MyPetsScreen } from "../features/pets/tela-07-meus-pets/Screen";
import { AddPetScreen } from "../features/pets/tela-07a-adicionar-pet/Screen";
import { PetProfileScreen } from "../features/pets/tela-08-perfil-pet/Screen";
import { RoutineScreen } from "../features/pets/tela-09-ver-rotina/Screen";
import { MedicinesScreen } from "../features/pets/tela-10-ver-remedios/Screen";
import { WalletScreen } from "../features/pets/tela-11-ver-carteira/Screen";
import { SharedCareScreen } from "../features/pets/tela-12-cuidado-compartilhado/Screen";
import { AddTutorScreen } from "../features/pets/tela-13-adicionar-tutor/Screen";
import { ChatbotBaluScreen } from "../features/comunicacao/tela-14-chatbot-balu/Screen";
import { CommunitiesScreen } from "../features/comunidade/tela-15-comunidades-tematicas/Screen";
import { CaramelClubScreen } from "../features/comunidade/tela-16-clube-caramelos/Screen";
import { findChatbotReply } from "../features/comunicacao/tela-14-chatbot-balu/matcher";

type View =
  | "login"
  | "account"
  | "home"
  | "pets"
  | "community"
  | "chat"
  | "pet"
  | "club"
  | "profile"
  | "care"
  | "appointment";
type Task = {
  id: string;
  time: string;
  title: string;
  description: string;
  done: boolean;
  xp: number;
};

const pets = [
  {
    name: "Balu",
    initial: "B",
    details: "Samoieda • 2 anos • 22 kg",
    badges: ["Carteira atualizada", "Cuidado compartilhado"],
  },
  {
    name: "Pipoca",
    initial: "P",
    details: "SRD • 4 anos • 12 kg",
    badges: ["Próxima vacina em agosto", "1 tutor vinculado"],
  },
  {
    name: "Pretinha",
    initial: "P",
    details: "SRD • 3 anos • 9 kg",
    badges: ["Carteira atualizada"],
  },
];
const initialTasks: Task[] = [
  {
    id: "food",
    time: "08:00",
    title: "Alimentação",
    description: "Ração Seca Premier • Feito por Leôncio",
    done: true,
    xp: 15,
  },
  {
    id: "medicine",
    time: "14:00",
    title: "Vermífugo Chemital",
    description: "Dar 1/2 comprimido via oral",
    done: false,
    xp: 30,
  },
  {
    id: "walk",
    time: "18:00",
    title: "Passeio Diário",
    description: "Meta diária: 20 min de caminhada",
    done: false,
    xp: 25,
  },
];
const nav = [
  { id: "home", label: "Início", Icon: Home, asset: "/assets/figma/home/07.svg" },
  { id: "pets", label: "Pets", Icon: PawPrint, asset: "/assets/figma/home/03.svg" },
  { id: "community", label: "Comunidade", Icon: Users, asset: "/assets/figma/home/04.svg" },
  { id: "chat", label: "Chat", Icon: Bot, asset: "/assets/figma/home/16.svg" },
] as const;

function Layout({
  active,
  navigate,
  children,
}: {
  active: View;
  navigate: (view: View) => void;
  children: React.ReactNode;
}) {
  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#202124] text-[#002045]">
      <div className="mx-auto h-full w-full max-w-[393px] overflow-y-auto bg-[#f7fafc] px-5 pb-[102px] pt-11">
        {children}
      </div>
      <nav className="absolute bottom-4 left-1/2 z-20 flex h-[66px] w-[calc(100%-40px)] max-w-[353px] -translate-x-1/2 justify-between rounded-[22px] border border-[#DCE6EF] bg-white px-2 py-2 shadow-[0_8px_16px_rgba(26,54,93,.04)]">
        {nav.map(({ id, label, asset }) => (
          <button
            key={id}
            onClick={() => navigate(id)}
            aria-label={label}
            className={`flex h-[50px] w-[70px] flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-medium ${active === id ? "bg-[#E6FFFA] text-[#002045]" : "text-[#6B8297]"}`}
          >
            <img src={asset} alt="" className="h-[18px] w-[18px]" />
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}

function Avatar({
  pet,
  selected = false,
  large = false,
}: {
  pet: (typeof pets)[number];
  selected?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`grid ${large ? "h-14 w-14" : "h-11 w-11"} place-items-center rounded-full border text-lg font-extrabold ${selected ? "border-2 border-[#24b09c] bg-[#e6f7f4]" : "border-[#b2f5ea] bg-[#e6fffa]"}`}
    >
      {pet.initial}
    </div>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-[#e6fffa] px-2.5 py-1 text-[11px] font-semibold text-[#183a78]">
      {children}
    </span>
  );
}
function Back({ navigate, to = "home" }: { navigate: (view: View) => void; to?: View }) {
  return (
    <button
      onClick={() => navigate(to)}
      aria-label="Voltar"
      className="grid h-9 w-9 place-items-center rounded-full bg-white"
    >
      <ArrowLeft size={20} />
    </button>
  );
}

function HomeScreen({
  navigate,
  tasks,
  setTasks,
}: {
  navigate: (view: View) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  const xp = tasks.filter((t) => t.done).reduce((sum, t) => sum + t.xp, 55);
  const level = 3 + Math.floor(xp / 100);
  const remaining = 100 - (xp % 100);
  const carouselAssets = [
    "/assets/figma/home/11.svg",
    "/assets/figma/home/09.svg",
    "/assets/figma/home/09.svg",
  ];
  return (
    <Layout active="home" navigate={navigate}>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#b2f5ea] font-bold">
            L
          </span>
          <div>
            <p className="text-[11px] font-medium text-[#4a5568]">Bom dia!</p>
            <h1 className="text-lg font-extrabold">Olá, Leôncio!</h1>
          </div>
        </div>
        <button
          onClick={() => navigate("chat")}
          className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f7f4]"
        >
          <Bell size={19} className="text-[#f8ca5c]" />
        </button>
      </header>
      <section className="mt-5 flex gap-4">
        {pets.map((pet, index) => (
          <button
            key={pet.name}
            className={`flex flex-col items-center gap-1 text-xs ${index === 0 ? "font-bold" : "text-[#4a5568]"}`}
          >
            <img src={carouselAssets[index]} alt="" className="h-14 w-14" />
            {pet.name}
          </button>
        ))}
        <button className="flex flex-col items-center gap-1 text-[10px] font-bold">
          <img src="/assets/figma/home/06.svg" alt="" className="h-14 w-14" />
          Adicionar
        </button>
      </section>
      <section className="mt-5 flex gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <img
          src="/assets/figma/home/xp-level-badge.png"
          alt="Badge de nível"
          className="h-12 w-12"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold">Nível {level}</h2>
          <p className="mt-1 text-[11px] text-[#4a5568]">
            Faltam {remaining} XP para o Nível {level + 1}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f2f4f5]">
            <div className="h-full rounded-full bg-[#24b09c]" style={{ width: `${xp % 100}%` }} />
          </div>
        </div>
      </section>
      <section className="mt-5">
        <h2 className="text-base font-extrabold">Rotina de Hoje</h2>
        <div className="mt-3 space-y-3">
          {tasks.map((task) => (
            <label
              key={task.id}
              className="flex min-h-[70px] cursor-pointer items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-3.5"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e6f7f4]">
                <img
                  src={
                    task.id === "food"
                      ? "/assets/figma/home/08.svg"
                      : task.id === "walk"
                        ? "/assets/figma/home/14.svg"
                        : "/assets/figma/home/08.svg"
                  }
                  alt=""
                  className="h-9 w-9"
                />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-[13px]">
                  {task.time} • {task.title}
                </b>
                <small className="block text-[11px] text-[#4a5568]">{task.description}</small>
              </span>
              <input
                aria-label={task.title}
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id ? { ...item, done: !item.done } : item,
                    ),
                  )
                }
                className="peer sr-only"
              />
              <span className="grid h-6 w-6 place-items-center rounded-lg border-2 border-[#74dfd2] text-white peer-checked:bg-[#24b09c]">
                <img
                  src="/assets/figma/home/15.svg"
                  alt=""
                  className={task.done ? "h-4 w-4" : "hidden"}
                />
              </span>
            </label>
          ))}
        </div>
      </section>
    </Layout>
  );
}

function PetsScreen({ navigate }: { navigate: (view: View) => void }) {
  return (
    <Layout active="pets" navigate={navigate}>
      <h1 className="text-xl font-extrabold">Meus pets</h1>
      <section className="mt-7 h-[170px] rounded-[18px] border border-[#e2e8f0] bg-white py-4 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#e6f7f4]">
          <PawPrint size={38} />
        </div>
        <h2 className="mt-2 text-lg font-bold">Escolha um pet</h2>
        <div className="mt-2 flex justify-center gap-2">
          <Pill>3 cadastrados</Pill>
          <Pill>1 principal</Pill>
        </div>
      </section>
      <div className="mt-7 space-y-5">
        {pets.map((pet) => (
          <article
            key={pet.name}
            className="min-h-[164px] rounded-[18px] border border-[#c2cad9] bg-white p-3 shadow-sm"
          >
            <div className="flex gap-3">
              <Avatar pet={pet} />
              <div>
                <h2 className="font-semibold text-[#183a78]">{pet.name}</h2>
                <p className="text-[13px] text-[#4a5568]">{pet.details}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {pet.badges.map((b) => (
                <Pill key={b}>{b}</Pill>
              ))}
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => navigate("pet")}
                className="rounded-full bg-[#183a78] px-3 py-2 text-[13px] font-semibold text-white"
              >
                Ver perfil
              </button>
              <button
                onClick={() => navigate("appointment")}
                className="rounded-full border border-[#c2cad9] bg-[#e6fffa] px-3 py-2 text-[13px] font-semibold"
              >
                Marcar Consulta
              </button>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}

function CommunityScreen({ navigate }: { navigate: (view: View) => void }) {
  return (
    <Layout active="community" navigate={navigate}>
      <h1 className="text-xl font-extrabold">Comunidades</h1>
      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-semibold">Minhas raças</h2>
        <button className="text-[13px] font-bold text-[#24b09c]">Ver tudo</button>
      </div>
      <div className="mt-4 flex gap-4">
        {["Caramelo", "Vira-lata", "Gateiros"].map((x) => (
          <button key={x} className="flex flex-col items-center gap-1 text-[10px] font-medium">
            <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-[#e6f7f4]">
              <PawPrint size={22} />
            </span>
            {x}
          </button>
        ))}
        <button className="flex flex-col items-center gap-1 text-[10px]">
          <span className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#e2e8f0] bg-white">
            <Plus />
          </span>
          Adicionar
        </button>
      </div>
      <label className="mt-5 flex h-[42px] items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-4">
        <Search size={16} />
        <input
          aria-label="Buscar na comunidade"
          placeholder="Buscar na comunidade..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>
      <article className="mt-5 h-[418px] rounded-[18px] border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <Pill>● Clube dos Caramelos</Pill>
        <p className="mt-3 text-[11px] text-[#4a5568]">2,4 mil membros</p>
        <h2 className="mt-2 max-w-[230px] text-lg font-bold">
          Uma comunidade para trocar dicas, rotina e cuidado com caramelos
        </h2>
        <div className="mt-4 rounded-xl border border-[#e2e8f0] p-3">
          <b className="text-xs">Salomão Rodrigues</b>
          <p className="mt-2 text-[11px]">
            O Balu soltou muito pelo essa semana e a escova de banho ajudou demais. Quem tem pet com
            pelagem parecida usa escovação diária?
          </p>
          <div className="mt-3 flex gap-4 text-[11px] text-[#4a5568]">
            <button>
              <Heart size={14} className="inline" /> 12 curtidas
            </button>
            <button>
              <MessageCircle size={14} className="inline" /> 4 comentários
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate("club")}
          className="mt-4 ml-auto block rounded-full bg-[#002045] px-5 py-3 text-[13px] font-bold text-white"
        >
          Entrar no clube
        </button>
      </article>
    </Layout>
  );
}

function ChatScreen({ navigate }: { navigate: (view: View) => void }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const send = () => {
    if (!draft.trim()) return;
    const text = draft;
    setMessages((m) => [
      ...m,
      { from: "user", text },
      { from: "bot", text: findChatbotReply(text).text },
    ]);
    setDraft("");
  };
  return (
    <Layout active="chat" navigate={navigate}>
      <header className="flex items-center gap-3">
        <Back navigate={navigate} />
        <span className="grid h-9 w-9 place-items-center rounded-full border border-[#b2f5ea] bg-[#e6f7f4]">
          <PawPrint size={17} />
        </span>
        <div>
          <h1 className="text-[15px] font-bold">Conversa com Balu</h1>
          <p className="text-[10px] text-[#24b09c]">Online • Assistente Virtual</p>
        </div>
      </header>
      <section className="mt-6 min-h-[45dvh] space-y-3">
        {messages.length === 0 && (
          <div className="grid place-items-center pt-24 text-center">
            <img
              src="/assets/figma/logo-balu.png"
              alt="Balu"
              className="h-24 w-24 object-contain"
            />
            <p className="mt-3 text-sm text-[#4a5568]">Como posso ajudar o Balu hoje?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <p
            key={i}
            className={`max-w-[82%] rounded-2xl px-4 py-3 text-[12px] ${m.from === "bot" ? "bg-[#e6f7f4]" : "ml-auto border border-[#e2e8f0] bg-white"}`}
          >
            {m.text}
          </p>
        ))}
      </section>
      <aside className="rounded-xl border border-[#fed7d7] bg-[#fff5f5] p-3 text-[10px] text-[#c53030]">
        <CircleHelp size={14} className="mr-2 inline" />A assistente virtual não substitui uma
        consulta. Se os sintomas persistirem, agende um atendimento.
      </aside>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        <button className="whitespace-nowrap rounded-full bg-[#c53030] px-3 py-2 text-[11px] font-bold text-white">
          Acionar Emergência
        </button>
        <button className="whitespace-nowrap rounded-full border px-3 py-2 text-[11px]">
          Dicas de Saúde
        </button>
      </div>
      <div className="mt-3 flex items-center rounded-2xl border border-[#e2e8f0] bg-white p-2">
        <input
          aria-label="Mensagem"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escreva sua mensagem..."
          className="h-10 flex-1 px-2 text-sm outline-none"
        />
        <button
          aria-label="Enviar"
          onClick={send}
          className="grid h-9 w-9 place-items-center rounded-full bg-[#b2f5ea]"
        >
          <Send size={16} />
        </button>
      </div>
    </Layout>
  );
}

function DetailScreen({
  view,
  navigate,
}: {
  view: Extract<View, "pet" | "club" | "profile" | "care" | "appointment">;
  navigate: (v: View) => void;
}) {
  const config = {
    pet: ["Perfil do Balu", "Samoieda • 2 anos • 22 kg"],
    club: ["Clube dos Caramelos", "Comunidade de tutores e seus pets"],
    profile: ["Perfil do tutor", "Leôncio Ferreira"],
    care: ["Cuidado compartilhado", "Tutores vinculados ao Balu"],
    appointment: ["Marcar consulta", "Selecione a clínica e o melhor horário"],
  }[view];
  return (
    <Layout active="pets" navigate={navigate}>
      <Back navigate={navigate} to={view === "club" ? "community" : "pets"} />
      <section className="mt-6 rounded-[18px] border border-[#e2e8f0] bg-white p-5 shadow-sm">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#e6f7f4]">
          <Stethoscope />
        </span>
        <h1 className="mt-4 text-xl font-extrabold">{config[0]}</h1>
        <p className="mt-1 text-sm text-[#4a5568]">{config[1]}</p>
        <div className="mt-6 space-y-3">
          {["Informações", "Saúde e vacinas", "Documentos", "Preferências"].map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between rounded-xl border border-[#e2e8f0] p-4 text-left text-sm font-semibold"
            >
              {item}
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default function App() {
  const tela = new URLSearchParams(window.location.search).get("tela")?.toLowerCase();
  const [screen, setScreen] = useState(tela);
  const [view, setView] = useState<View>("login");
  const [tasks, setTasks] = useState(initialTasks);
  const open = (next: View) => {
    window.history.replaceState({}, "", "/");
    setScreen(undefined);
    setView(next);
  };
  const openScreen = (next: string) => {
    window.history.replaceState({}, "", `/?tela=${next}`);
    setScreen(next);
  };
  if (screen === "2")
    return <CreateAccountScreen onEnter={() => openScreen("3")} onLogin={() => open("login")} />;
  if (screen === "3")
    return <RegisterPetScreen onBack={() => open("account")} onComplete={() => openScreen("4")} />;
  if (screen === "4" || screen === "4g" || screen === "4t")
    return <ExperienceScreen onBack={() => openScreen("3")} onComplete={() => open("home")} />;
  if (screen && numberedScreenComponents[screen]) {
    const NumberedScreen = numberedScreenComponents[screen];
    return <NumberedScreen />;
  }
  if (screen && numberedScreens[screen]) {
    const item = numberedScreens[screen];
    return (
      <InformationScreen
        {...item}
        onBack={() => open(item.back)}
        onAction={() => open(item.action ?? item.back)}
      />
    );
  }
  if (view === "login")
    return (
      <LoginScreen onEnter={() => setView("home")} onCreateAccount={() => setView("account")} />
    );
  if (view === "account")
    return <CreateAccountScreen onEnter={() => openScreen("3")} onLogin={() => setView("login")} />;
  if (view === "home") return <HomeScreen navigate={setView} tasks={tasks} setTasks={setTasks} />;
  if (view === "pets") return <PetsScreen navigate={setView} />;
  if (view === "community") return <CommunityScreen navigate={setView} />;
  if (view === "chat") return <ChatScreen navigate={setView} />;
  return <DetailScreen view={view} navigate={setView} />;
}

const numberedScreenComponents: Record<string, ComponentType> = {
  "5": HomeTutorScreen,
  "5a": HomeMedicineDoneScreen,
  "5b": HomeWalkDoneScreen,
  "5t": TraditionalHomeScreen,
  "5ta": TraditionalHomeMedicineScreen,
  "5tb": TraditionalHomeWalkScreen,
  "6": TutorProfileScreen,
  "6a": NotificationsScreen,
  "6b": ClinicLinkScreen,
  "7": MyPetsScreen,
  "7a": AddPetScreen,
  "8": PetProfileScreen,
  "9": RoutineScreen,
  "10": MedicinesScreen,
  "11": WalletScreen,
  "12": SharedCareScreen,
  "13": AddTutorScreen,
  "14": ChatbotBaluScreen,
  "15": CommunitiesScreen,
  "16": CaramelClubScreen,
};

const numberedScreens: Record<
  string,
  {
    title: string;
    subtitle: string;
    items: { title: string; description?: string }[];
    button?: string;
    back: View;
    action?: View;
  }
> = {
  "5": {
    title: "Início",
    subtitle: "Rotina do Balu",
    items: [
      { title: "Rotina de hoje", description: "3 cuidados programados" },
      { title: "Nível 3", description: "Continue cuidando para ganhar XP" },
    ],
    back: "home",
  },
  "5a": {
    title: "Cuidado concluído",
    subtitle: "Vermífugo registrado",
    items: [{ title: "Vermífugo Chemital", description: "Concluído às 14:00" }],
    back: "home",
  },
  "5b": {
    title: "Cuidado concluído",
    subtitle: "Passeio registrado",
    items: [{ title: "Passeio Diário", description: "Meta diária concluída" }],
    back: "home",
  },
  "5t": {
    title: "Início",
    subtitle: "Experiência tradicional",
    items: [{ title: "Rotina de hoje", description: "Cuidado e bem-estar do Balu" }],
    back: "home",
  },
  "5ta": {
    title: "Rotina atualizada",
    subtitle: "Vermífugo concluído",
    items: [{ title: "Vermífugo Chemital", description: "Concluído" }],
    back: "home",
  },
  "5tb": {
    title: "Rotina atualizada",
    subtitle: "Passeio concluído",
    items: [{ title: "Passeio Diário", description: "Concluído" }],
    back: "home",
  },
  "6": {
    title: "Perfil do tutor",
    subtitle: "Leôncio Ferreira",
    items: [
      { title: "Dados pessoais", description: "E-mail e telefone" },
      { title: "Preferências", description: "Experiência gamificada" },
    ],
    back: "home",
  },
  "6a": {
    title: "Notificações",
    subtitle: "Acompanhe os lembretes do Balu",
    items: [
      { title: "Vermífugo Chemital", description: "Hoje às 14:00" },
      { title: "Vacina anual", description: "Em 12 de agosto" },
    ],
    back: "home",
  },
  "6b": {
    title: "Vínculo com clínica",
    subtitle: "Conecte o Balu à clínica veterinária",
    items: [{ title: "Clínica Vet Mais", description: "Aguardando aprovação" }],
    button: "Enviar solicitação",
    back: "pets",
  },
  "7": {
    title: "Meus pets",
    subtitle: "Escolha um pet para ver os cuidados",
    items: [
      { title: "Balu", description: "Samoieda • 2 anos" },
      { title: "Pipoca", description: "SRD • 4 anos" },
      { title: "Pretinha", description: "SRD • 3 anos" },
    ],
    button: "Adicionar pet",
    back: "pets",
    action: "pets",
  },
  "7a": {
    title: "Adicionar pet",
    subtitle: "Cadastre mais um companheiro",
    items: [{ title: "Dados básicos", description: "Nome, espécie e raça" }],
    button: "Cadastrar pet",
    back: "pets",
  },
  "8": {
    title: "Perfil do pet",
    subtitle: "Balu • Samoieda",
    items: [
      { title: "Rotina", description: "Alimentação, passeios e cuidados" },
      { title: "Medicamentos", description: "1 medicamento ativo" },
      { title: "Carteira", description: "Vacinas e documentos" },
    ],
    back: "pets",
  },
  "9": {
    title: "Rotina",
    subtitle: "Cuidados do Balu",
    items: [
      { title: "08:00 • Alimentação", description: "Concluído" },
      { title: "14:00 • Vermífugo Chemital", description: "Pendente" },
      { title: "18:00 • Passeio diário", description: "Pendente" },
    ],
    back: "pets",
  },
  "10": {
    title: "Medicamentos do pet",
    subtitle: "Histórico e próximos horários",
    items: [
      { title: "Vermífugo Chemital", description: "Hoje às 14:00" },
      { title: "Adicionar medicamento", description: "Registre um novo cuidado" },
    ],
    back: "pets",
  },
  "11": {
    title: "Carteira do pet",
    subtitle: "Vacinas e documentos do Balu",
    items: [
      { title: "Vacina antirrábica", description: "Em dia" },
      { title: "Carteira de vacinação", description: "Atualizada" },
    ],
    back: "pets",
  },
  "12": {
    title: "Cuidado compartilhado",
    subtitle: "Pessoas que cuidam do Balu",
    items: [
      { title: "Leôncio", description: "Tutor principal" },
      { title: "Adicionar tutor", description: "Compartilhe os cuidados" },
    ],
    button: "Convidar tutor",
    back: "pets",
  },
  "13": {
    title: "Adicionar tutor",
    subtitle: "Convide alguém para cuidar junto",
    items: [{ title: "E-mail do tutor", description: "O convite será enviado por e-mail" }],
    button: "Enviar convite",
    back: "pets",
  },
  "14": {
    title: "Conversa com Balu",
    subtitle: "Assistente virtual",
    items: [{ title: "Dicas de saúde", description: "Pergunte sobre a rotina do seu pet" }],
    button: "Ir para o chat",
    back: "chat",
    action: "chat",
  },
  "15": {
    title: "Comunidades temáticas",
    subtitle: "Encontre outros tutores",
    items: [
      { title: "Clube dos Caramelos", description: "2,4 mil membros" },
      { title: "Gateiros unidos", description: "1,8 mil membros" },
    ],
    button: "Explorar comunidades",
    back: "community",
  },
  "16": {
    title: "Clube dos Caramelos",
    subtitle: "Uma comunidade para trocar experiências",
    items: [
      { title: "Publicações", description: "Confira as conversas do clube" },
      { title: "Membros", description: "2,4 mil tutores" },
    ],
    button: "Entrar no clube",
    back: "community",
  },
};
