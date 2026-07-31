import type { ReactNode } from "react";
import { Bot, Home, PawPrint, Users } from "lucide-react";

export type MainDestination = "home" | "pets" | "community" | "chat";

type Props = {
  children: ReactNode;
  active?: MainDestination;
  onNavigate?: (destination: MainDestination) => void;
  padded?: boolean;
};

const items = [
  { destination: "home", label: "Início", Icon: Home },
  { destination: "pets", label: "Pets", Icon: PawPrint },
  { destination: "community", label: "Comunidade", Icon: Users },
  { destination: "chat", label: "Chat", Icon: Bot },
] as const;

export function MobileShell({ children, active, onNavigate, padded = true }: Props) {
  return (
    <main className="min-h-[100dvh] bg-[#202124] text-[#002045]">
      <section className={`relative mx-auto min-h-[100dvh] w-full max-w-[393px] bg-[#f7fafc] ${padded ? "px-5 pt-8" : ""} ${onNavigate ? "pb-[104px]" : "pb-8"}`}>
        {children}
        {onNavigate && <BottomNavigation active={active} onNavigate={onNavigate} />}
      </section>
    </main>
  );
}

export function BottomNavigation({ active, onNavigate }: Pick<Props, "active" | "onNavigate"> & { onNavigate: (destination: MainDestination) => void }) {
  return (
    <nav aria-label="Navegação principal" className="fixed bottom-5 left-1/2 z-20 flex h-[66px] w-[calc(100%-40px)] max-w-[353px] -translate-x-1/2 justify-between rounded-[22px] border border-[#dce6ef] bg-white px-2 py-2 shadow-[0_8px_16px_rgba(26,54,93,.04)]">
      {items.map(({ destination, label, Icon }) => (
        <button key={destination} type="button" aria-label={label} onClick={() => onNavigate(destination)} className={`flex h-[50px] min-w-[64px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[10px] font-semibold ${active === destination ? "bg-[#e6fffa] text-[#002045]" : "text-[#6b8297]"}`}>
          <Icon size={18} strokeWidth={active === destination ? 2.7 : 2.1} />
          {label}
        </button>
      ))}
    </nav>
  );
}
