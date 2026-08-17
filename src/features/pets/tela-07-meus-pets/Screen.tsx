import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import { MobileShell, type MainDestination } from "../../../components/ui/MobileShell";
import { usePetProfile } from "../../../components/ui/pet-profile/PetProfileContext";

export function MyPetsScreen({
  onNavigate = () => undefined,
  onOpen,
  onAddPet,
  onEditPet,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpen?: (screen: string) => void;
  onAddPet?: () => void;
  onEditPet?: () => void;
}) {
  const { pet, removePet } = usePetProfile();
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
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
            <span className="rounded-full bg-[#f2f4f5] px-2.5 py-[6px]">
              {pet ? 1 : 0} cadastrado
            </span>
            <span className="rounded-full bg-[#f2f4f5] px-4 py-[6px]">{pet ? 1 : 0} principal</span>
            <span className="rounded-full bg-[#f2f4f5] px-2 py-[6px]">
              {pet ? 1 : 0} compartilhado
            </span>
          </div>
        </section>
        <div className="mt-[27px] space-y-[26px]">
          {pet ? (
            <article className="min-h-[220px] rounded-[18px] border border-[#e2e8f0] bg-white p-[13px]">
              <div className="flex gap-3">
                <img
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                  src={pet.photoUrl}
                  alt={`Foto do ${pet.name}`}
                />
                <div>
                  <h2 className="text-[16px] font-semibold leading-5 text-[#183a78]">{pet.name}</h2>
                  <div className="mt-1 flex gap-1.5 text-[11px] leading-4 text-[#4a5568]">
                    {[pet.breed, pet.age, pet.weight].map((detail) => (
                      <span className="rounded-full bg-[#f2f4f5] px-2" key={detail}>
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpen?.("11")}
                  className="flex items-center gap-1 whitespace-nowrap rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[11px] font-semibold text-[#4a5568] transition-colors hover:bg-[#f1f5f9]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#24a995]" aria-hidden="true" />
                  Carteira atualizada
                </button>
                <button
                  type="button"
                  onClick={() => onOpen?.("12")}
                  className="flex items-center gap-1 whitespace-nowrap rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[11px] font-semibold text-[#4a5568] transition-colors hover:bg-[#f1f5f9]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3182ce]" aria-hidden="true" />
                  Cuidado compartilhado
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpen?.("8")}
                  className="rounded-full bg-[#183a78] px-3 py-2 text-[13px] font-semibold text-white"
                >
                  Abrir funcionalidades
                </button>
                <button
                  type="button"
                  onClick={() => onOpen?.("7b")}
                  className="rounded-full border border-[#e2e8f0] bg-[#e6fffa] px-3 py-2 text-[13px] font-semibold text-[#183a78]"
                >
                  Consultas
                </button>
                <button
                  type="button"
                  aria-label={`Editar pet ${pet.name}`}
                  onClick={onEditPet}
                  className="flex items-center justify-center gap-1 rounded-full border border-[#183a78] px-3 py-2 text-[13px] font-semibold"
                >
                  <Pencil aria-hidden="true" size={14} />
                  Editar
                </button>
                <button
                  type="button"
                  aria-label={`Excluir pet ${pet.name}`}
                  onClick={() => setConfirmingRemoval(true)}
                  className="flex items-center justify-center gap-1 rounded-full border border-[#d33] px-3 py-2 text-[13px] font-semibold text-[#c22]"
                >
                  <Trash2 aria-hidden="true" size={14} />
                  Excluir
                </button>
              </div>
            </article>
          ) : (
            <p className="my-pets-screen__empty">Nenhum pet na sua lista.</p>
          )}
        </div>
        <button
          onClick={onAddPet}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-[#183a78] text-sm font-bold text-[#183a78]"
        >
          <img
            className="relative -top-px h-7 w-7"
            src="/assets/figma/pets/routine-add.svg"
            alt=""
          />
          Adicionar novo pet
        </button>
        {confirmingRemoval && (
          <RemovePetDialog
            petName={pet?.name ?? "pet"}
            onClose={() => setConfirmingRemoval(false)}
            onConfirm={() => {
              removePet();
              setConfirmingRemoval(false);
            }}
          />
        )}
      </div>
    </MobileShell>
  );
}

function RemovePetDialog({
  petName,
  onClose,
  onConfirm,
}: {
  petName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const handler = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div className="my-pets-dialog-backdrop">
      <section role="dialog" aria-modal="true" aria-label="Remover pet da lista">
        <button ref={closeRef} type="button" aria-label="Fechar" onClick={onClose}>
          <X aria-hidden="true" size={18} />
        </button>
        <h2>Remover pet da lista</h2>
        <p>
          Deseja remover {petName} da sua lista? O prontuário clínico será preservado por segurança.
        </p>
        <div>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm}>
            Confirmar remoção
          </button>
        </div>
      </section>
    </div>
  );
}
