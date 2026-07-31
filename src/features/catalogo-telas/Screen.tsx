type NavTarget = "home" | "pets" | "community" | "chat";
type Props = { numero: string; titulo: string; imagem?: string; onNavigate?: (target: NavTarget) => void };

type HomeProps = { onNavigate: (view: NavTarget) => void; onCompleteMedicine: () => void; onCompleteWalk: () => void; medicineDone: boolean; walkDone: boolean };

/** Frame 18:2. A imagem exportada conserva os vetores e a geometria originais do Figma. */
export function FigmaHomeScreen({ onNavigate, onCompleteMedicine, onCompleteWalk, medicineDone, walkDone }: HomeProps) {
  const image = walkDone ? "/assets/figma/tela-05b.png" : medicineDone ? "/assets/figma/tela-05a.png" : "/assets/figma/tela-05-home.png";
  return <main className="min-h-[100dvh] bg-[#202124]"><section className="relative mx-auto min-h-[100dvh] w-full max-w-[393px] overflow-hidden"><img src={image} alt="Tela 5: Home do Tutor" className="block h-auto w-full" /><h1 className="sr-only">Olá, Leôncio!</h1><h2 className="sr-only">Nível {medicineDone ? 4 : 3}</h2><input aria-label="Vermífugo Chemital" type="checkbox" checked={medicineDone} onChange={onCompleteMedicine} className="absolute z-10 left-[calc(50%+115px)] top-[444px] h-8 w-8 cursor-pointer opacity-0" /><input aria-label="Passeio Diário" type="checkbox" checked={walkDone} onChange={onCompleteWalk} className="absolute z-10 left-[calc(50%+115px)] top-[520px] h-8 w-8 cursor-pointer opacity-0" /><button aria-label="Início" onClick={() => onNavigate("home")} className="absolute z-10 bottom-[21px] left-[5%] h-14 w-[18%]" /><button aria-label="Pets" onClick={() => onNavigate("pets")} className="absolute z-10 bottom-[21px] left-[23%] h-14 w-[18%]" /><button aria-label="Comunidade" onClick={() => onNavigate("community")} className="absolute z-10 bottom-[21px] left-[42%] h-14 w-[24%]" /><button aria-label="Chat" onClick={() => onNavigate("chat")} className="absolute z-10 bottom-[21px] right-[5%] h-14 w-[18%]" /></section></main>;
}

/** Frames estáticos do Figma que ainda não possuem fluxo interativo próprio. */
export function CatalogScreen({ numero, titulo, imagem, onNavigate }: Props) {
  return <main className="min-h-[100dvh] bg-[#202124] text-[#002045]"><section className="relative mx-auto min-h-[100dvh] w-full max-w-[393px] overflow-hidden bg-[#f7fafc]">
    {imagem ? <img src={imagem} alt={`Tela ${numero}: ${titulo}`} className="block h-auto w-full" /> : <div className="flex min-h-[100dvh] flex-col justify-between p-5 pt-11"><header><p className="text-xs font-bold text-[#4a9e8f]">TELA {numero}</p><h1 className="mt-2 text-2xl font-extrabold">{titulo}</h1></header><img src="/assets/figma/logo-balu.png" alt="Balu" className="mx-auto w-44" /><p className="rounded-2xl border border-[#dce6ef] bg-white p-4 text-sm text-[#6b8297]">Esta tela será conectada ao fluxo correspondente do Balu.</p></div>}
    {imagem && <><h1 className="sr-only">{titulo}</h1>{onNavigate && <nav aria-label="Navegação principal" className="absolute inset-x-0 bottom-0 z-10 h-[86px]"><button aria-label="Início" onClick={() => onNavigate("home")} className="absolute bottom-[21px] left-[5%] h-14 w-[18%]" /><button aria-label="Pets" onClick={() => onNavigate("pets")} className="absolute bottom-[21px] left-[23%] h-14 w-[18%]" /><button aria-label="Comunidade" onClick={() => onNavigate("community")} className="absolute bottom-[21px] left-[42%] h-14 w-[24%]" /><button aria-label="Chat" onClick={() => onNavigate("chat")} className="absolute bottom-[21px] right-[5%] h-14 w-[18%]" /></nav>}</>}
  </section></main>;
}

export const figmaScreens: Record<string, { titulo: string; imagem?: string }> = {
  "2": { titulo: "Criar Conta" }, "3": { titulo: "Cadastrar Pet", imagem: "/assets/figma/tela-03.png" }, "4": { titulo: "Escolha de Experiência", imagem: "/assets/figma/tela-04.png" },
  "4t": { titulo: "Experiência Tradicional Selecionada", imagem: "/assets/figma/tela-04.png" }, "4g": { titulo: "Experiência Gamificada Selecionada", imagem: "/assets/figma/tela-04g.png" },
  "5": { titulo: "Home do Tutor", imagem: "/assets/figma/tela-05-home.png" }, "5a": { titulo: "Home do Tutor — Vermífugo Concluído", imagem: "/assets/figma/tela-05a.png" }, "5b": { titulo: "Home do Tutor — Passeio Concluído", imagem: "/assets/figma/tela-05b.png" },
  "5t": { titulo: "Home Tradicional", imagem: "/assets/figma/tela-05t.png" }, "5ta": { titulo: "Home Tradicional — Vermífugo Concluído", imagem: "/assets/figma/tela-05ta.png" }, "5tb": { titulo: "Home Tradicional — Passeio Concluído", imagem: "/assets/figma/tela-05tb.png" },
  "6": { titulo: "Perfil do Tutor", imagem: "/assets/figma/tela-06.png" }, "6a": { titulo: "Notificações", imagem: "/assets/figma/tela-06a.png" }, "6b": { titulo: "Solicitação de Vínculo com Clínica", imagem: "/assets/figma/tela-06b.png" },
  "7": { titulo: "Meus Pets", imagem: "/assets/figma/tela-07.png" }, "7a": { titulo: "Adicionar Pet", imagem: "/assets/figma/tela-07a.png" }, "8": { titulo: "Perfil do Pet", imagem: "/assets/figma/tela-08.png" },
  "9": { titulo: "Ver rotina", imagem: "/assets/figma/tela-09.png" }, "10": { titulo: "Medicamentos do Pet", imagem: "/assets/figma/tela-10.png" }, "11": { titulo: "Ver carteira", imagem: "/assets/figma/tela-11.png" },
  "12": { titulo: "Cuidado Compartilhado", imagem: "/assets/figma/tela-12.png" }, "13": { titulo: "Adicionar Tutor", imagem: "/assets/figma/tela-13.png" },
  "14": { titulo: "Chatbot Balu", imagem: "/assets/figma/tela-14.png" }, "15": { titulo: "Comunidades Temáticas", imagem: "/assets/figma/tela-15.png" }, "16": { titulo: "Clube dos Caramelos", imagem: "/assets/figma/tela-16.png" },
};
