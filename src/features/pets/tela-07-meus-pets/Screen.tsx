import { useRef, useState } from "react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { AppointmentModal } from "./AppointmentModal";

const pets = [
  ["B", "Balu", ["Samoieda", "2 anos", "22 kg"], ["Carteira atualizada", "Cuidado compartilhado"]],
] as const;

export function MyPetsScreen({
  onNavigate = () => undefined,
  onOpen,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpen?: (screen: string) => void;
}) {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const appointmentButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <MobileShell active="pets" onNavigate={onNavigate}>
      <div className="my-pets-screen">
        <h1 className="mt-1 text-[20px] font-bold leading-[25px] text-[#183a78]">Meus pets</h1>
        <section className="mt-6 h-[170px] rounded-[18px] border-[1.5px] border-[#e2e8f0] bg-white px-3 pt-[15px] text-center shadow-[0_8px_16px_rgba(26,54,93,.04)]">
          <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#e6f7f4]">
            <img src="/assets/figma/home/11.svg" alt="" className="h-20 w-20" />
          </div>
          <h2 className="mt-1 text-[18px] font-bold leading-6 text-[#183a78]">Escolha um pet</h2>
          <div className="mt-2.5 flex justify-center gap-3 text-[11px] font-semibold leading-3 text-[#4a5568]">
            <span className="rounded-full bg-[#f2f4f5] px-2.5 py-[6px]">1 cadastrado</span>
            <span className="rounded-full bg-[#f2f4f5] px-4 py-[6px]">1 principal</span>
            <span className="rounded-full bg-[#f2f4f5] px-2 py-[6px]">1 compartilhado</span>
          </div>
        </section>
        <div className="mt-[27px] space-y-[26px]">
          {pets.map(([initial, name, details, badges]) => (
            <article
              key={name}
              className="h-[164px] rounded-[18px] border border-[#e2e8f0] bg-white p-[13px]"
            >
              <div className="flex gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[22px] border border-[#b2f5ea] bg-[#e6fffa] text-[18px] font-extrabold leading-none text-[#183a78]">
                  {initial}
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold leading-5 text-[#183a78]">{name}</h2>
                  <div className="mt-1 flex gap-1.5 text-[11px] leading-4 text-[#4a5568]">
                    {details.map((detail) => (
                      <span className="rounded-full bg-[#f2f4f5] px-2" key={detail}>
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="whitespace-nowrap rounded-full bg-[#e6fffa] px-2.5 py-[6px] text-[12px] font-semibold leading-3 text-[#183a78]"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => onOpen?.("8")}
                  className="rounded-full bg-[#183a78] px-3 py-2 text-[13px] font-semibold leading-4 text-white"
                >
                  Ver perfil
                </button>
                <button
                  ref={appointmentButtonRef}
                  type="button"
                  onClick={() => setAppointmentOpen(true)}
                  className="rounded-full border border-[#e2e8f0] bg-[#e6fffa] px-3 py-2 text-[13px] font-semibold leading-4 text-[#183a78]"
                >
                  Marcar Consulta
                </button>
              </div>
            </article>
          ))}
        </div>
        <button
          onClick={() => onOpen?.("7a")}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#183a78] text-sm font-bold text-[#183a78]"
        >
          <img
            className="relative -top-px h-7 w-7"
            src="/assets/figma/pets/routine-add.svg"
            alt=""
          />
          Adicionar novo pet
        </button>
        {appointmentOpen && (
          <AppointmentModal
            petName="Balu"
            onClose={() => setAppointmentOpen(false)}
            returnFocusRef={appointmentButtonRef}
          />
        )}
      </div>
    </MobileShell>
  );
}
