import { createContext, useContext, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";

export type MainDestination = "home" | "pets" | "community" | "chat" | "profile";

type Props = {
  children: ReactNode;
  active?: MainDestination;
  onNavigate?: (destination: MainDestination) => void;
  padded?: boolean;
};

const items = [
  { destination: "home", label: "Início", asset: "/assets/figma/home/07.svg" },
  { destination: "pets", label: "Pets", asset: "/assets/figma/home/03.svg" },
  { destination: "community", label: "Comunidade", asset: "/assets/figma/home/04.svg" },
  { destination: "chat", label: "Chat", asset: "/assets/figma/home/16.svg" },
  { destination: "profile", label: "Perfil", asset: "/assets/figma/home/05.svg" },
] as const;

const MainNavigationContext = createContext<Props["onNavigate"]>(undefined);

export function MainNavigationProvider({
  children,
  onNavigate,
}: Pick<Props, "children" | "onNavigate">) {
  return (
    <MainNavigationContext.Provider value={onNavigate}>{children}</MainNavigationContext.Provider>
  );
}

export function MobileShell({ children, active, onNavigate, padded = true }: Props) {
  const contextualNavigate = useContext(MainNavigationContext);
  const effectiveNavigate = onNavigate ? (contextualNavigate ?? onNavigate) : undefined;

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#202124] text-[#183a78]">
      <section
        className={`balu-mobile-shell relative mx-auto h-full w-full max-w-[393px] overflow-x-hidden overflow-y-auto bg-[#f7fafc] ${padded ? "px-5 pt-11" : ""} ${effectiveNavigate ? "pb-[106px]" : "pb-8"}`}
      >
        {children}
        {effectiveNavigate && <BottomNavigation active={active} onNavigate={effectiveNavigate} />}
      </section>
    </main>
  );
}

export function BottomNavigation({
  active,
  onNavigate,
}: Pick<Props, "active" | "onNavigate"> & { onNavigate: (destination: MainDestination) => void }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-4 left-1/2 z-20 flex h-[66px] w-[calc(100%-40px)] max-w-[353px] -translate-x-1/2 justify-between rounded-[22px] border border-[#e2e8f0] bg-white px-[9px] py-[7px] shadow-[0_4px_12px_rgba(24,58,120,.06)]"
    >
      {items.map(({ destination, label, asset }) => (
        <button
          key={destination}
          type="button"
          aria-label={label}
          onClick={() => onNavigate(destination)}
          className={`flex shrink-0 flex-col items-center justify-center gap-[3px] rounded-2xl ${destination === "community" ? "w-[80px]" : "w-[62px]"} ${active === destination ? "h-[46px] border border-[#b2f5ea] bg-[#e6fffa] text-[10px] font-bold text-[#002045]" : "h-[50px] font-normal text-[#4a5568] text-[10px]"}`}
        >
          {destination === "chat" ? (
            <MessageCircle aria-hidden="true" size={20} strokeWidth={2.2} />
          ) : (
            <img
              src={asset}
              alt=""
              className={destination === "community" ? "h-5 w-5" : "h-[18px] w-[18px]"}
            />
          )}
          {label}
        </button>
      ))}
    </nav>
  );
}
