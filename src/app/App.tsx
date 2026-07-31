import { useState } from "react";
import { Bell, Bot, HeartPulse, Home, PawPrint, Users } from "lucide-react";
import { LoginScreen } from "../features/acesso/tela-01-login/Screen";
import { findChatbotReply } from "../features/comunicacao/tela-14-chatbot-balu/matcher";

type View = "login" | "home" | "chat" | "pets" | "community";
const nav = [{ id: "home", label: "Início", Icon: Home }, { id: "pets", label: "Pets", Icon: PawPrint }, { id: "community", label: "Comunidade", Icon: Users }, { id: "chat", label: "Chat", Icon: Bot }] as const;

function Navigation({ active, navigate }: { active: View; navigate: (view: View) => void }) {
  return <nav className="fixed bottom-5 left-1/2 flex h-[66px] w-[calc(100%-40px)] max-w-[353px] -translate-x-1/2 justify-around rounded-[22px] bg-white px-2 py-2 shadow-none">{nav.map(({ id, label, Icon }) => <button key={id} aria-label={label} onClick={() => navigate(id)} className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] ${active === id ? "bg-[#e6f7f4] text-[#002045]" : "text-[#4a5568]"}`}><Icon size={18} strokeWidth={2.5} />{label}</button>)}</nav>;
}

function HomeScreen({ navigate }: { navigate: (view: View) => void }) {
  return <main className="min-h-screen bg-[#f8fafc] px-5 pb-28 pt-11 text-[#183a78]"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#b2f5ea] font-bold">L</span><div><small className="text-[#6f8092]">Bom dia!</small><h1 className="font-extrabold">Olá, Leôncio!</h1></div></div><button onClick={() => navigate("chat")} className="rounded-full bg-white p-3 shadow-sm" aria-label="Notificações"><Bell size={18}/></button></div><div className="mt-5 flex gap-4"><button className="flex flex-col items-center text-xs font-bold"><span className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#66d9ca] bg-white"><PawPrint/></span>Balu</button><button className="flex flex-col items-center text-xs"><span className="grid h-14 w-14 place-items-center rounded-full bg-white"><PawPrint/></span>Pipoca</button></div><section className="mt-5 rounded-2xl bg-white p-4 shadow-sm"><div className="flex gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e2faf5]"><HeartPulse/></span><div><b>Nível 3</b><p className="text-xs text-[#6f8092]">Faltam 70 XP para o Nível 4</p><i className="mt-2 block h-1.5 w-56 rounded bg-[#35cdbd]" /></div></div></section><h2 className="mt-5 font-extrabold">Rotina de Hoje</h2>{[["08:00", "Alimentação", "Concluída"],["14:00", "Vermífugo Chemital", "Hoje"],["18:00", "Passeio Diário", "Hoje"]].map(([time,title,status])=><article key={title} className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eafaf7]"><PawPrint size={16}/></span><p className="flex-1 text-xs"><b>{time} · {title}</b><br/><span className="text-[#6f8092]">Rotina do Balu</span></p><small className="rounded-full bg-[#e2faf0] px-2 py-1 text-[10px] text-[#27a471]">{status}</small></article>)}<Navigation active="home" navigate={navigate}/></main>;
}

function ExactHomeScreen({ navigate }: { navigate: (view: View) => void }) {
  return <main className="h-[100dvh] overflow-hidden bg-[#202020] text-[#183a78]"><div className="relative mx-auto h-[100dvh] w-full max-w-[393px] overflow-hidden bg-[#f7fafc]"><img src="/assets/figma/tela-05-home.png" alt="Tela inicial do tutor Balu" className="block h-auto w-full" /><button aria-label="Notificações" onClick={() => navigate("chat")} className="absolute right-[20px] top-[44px] h-10 w-10" /><FrameHotspots navigate={navigate} /></div></main>;
}

const frameByView: Record<Exclude<View, "login" | "home" | "chat">, string> = {
  pets: "/assets/figma/tela-07.png",
  community: "/assets/figma/tela-15.png",
};

function FrameHotspots({ navigate }: { navigate: (view: View) => void }) {
  return <div className="absolute inset-x-0 bottom-5 h-[66px]" aria-label="Navegação inferior">{([['home','Início','left-5 w-[70px]'],['pets','Pets','left-[90px] w-[70px]'],['community','Comunidade','left-[170px] w-[94px]'],['chat','Chat','right-5 w-[70px]']] as const).map(([view,label,position]) => <button key={view} aria-label={label} onClick={() => navigate(view)} className={`absolute inset-y-0 ${position}`} />)}</div>;
}

function ExactFrame({ view, navigate }: { view: Exclude<View, "login" | "home" | "chat">; navigate: (view: View) => void }) {
  const scrollable = view === "pets" || view === "community";
  return <main className="h-[100dvh] bg-[#202020]"><div className={`relative mx-auto h-[100dvh] w-full max-w-[393px] bg-[#f7fafc] ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}><img src={frameByView[view]} alt={`Tela ${view} do Balu`} className={`block h-auto w-full ${scrollable ? "[clip-path:inset(0_0_86px_0)]" : ""}`} /><FrameHotspots navigate={navigate} /></div></main>;
}

function ChatScreen({ navigate }: { navigate: (view: View) => void }) { const [messages,setMessages]=useState<{from:"bot"|"user";text:string}[]>([{from:"bot",text:"Oi! Sou o Balu, seu assistente virtual. Qual pet você quer ajudar agora?"}]); const [draft,setDraft]=useState(""); const send=()=>{ if(!draft.trim())return; const question=draft; setMessages((items)=>[...items,{from:"user",text:question},{from:"bot",text:findChatbotReply(question).text}]); setDraft("");}; return <main className="min-h-screen bg-[#f8fafc] px-5 pb-28 pt-10 text-[#183a78]"><header className="flex items-center gap-3"><button onClick={()=>navigate("home")}>←</button><img src="/assets/figma/logo-balu.png" className="h-9 w-9 rounded-full object-cover" alt="Balu"/><div><h1 className="font-extrabold">Converse com Balu</h1><small className="text-[#27a471]">● Online agora</small></div></header><div className="mt-6 space-y-3">{messages.map((message,index)=><p key={index} className={`max-w-[80%] rounded-2xl p-3 text-sm ${message.from==="user"?"ml-auto bg-[#183a78] text-white":"bg-white text-[#4a5568]"}`}>{message.text}</p>)}</div><div className="fixed bottom-24 left-1/2 flex w-[calc(100%-40px)] max-w-[353px] -translate-x-1/2 rounded-2xl bg-white p-2 shadow-lg"><input aria-label="Mensagem" value={draft} onChange={(e)=>setDraft(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&send()} placeholder="Escreva sua mensagem..." className="min-w-0 flex-1 px-3 outline-none"/><button aria-label="Enviar" onClick={send} className="rounded-xl bg-[#b2f5ea] px-3 font-bold">↑</button></div><Navigation active="chat" navigate={navigate}/></main>; }

export default function App() { const [view,setView]=useState<View>("login"); if(view==="login")return <LoginScreen onEnter={()=>setView("home")}/>; if(view==="chat")return <ChatScreen navigate={setView}/>; if(view==="home")return <ExactHomeScreen navigate={setView}/>; return <ExactFrame view={view} navigate={setView}/>; }
