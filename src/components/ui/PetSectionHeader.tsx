import { ArrowLeft } from "lucide-react";
import { PetPhotoPicker } from "./pet-photo-picker/PetPhotoPicker";
import { usePetProfile } from "./pet-profile/PetProfileContext";

type PetSection = "overview" | "routine" | "medicines" | "wallet";

const tabs = [
  { section: "overview", label: "Visão geral", screen: "8" },
  { section: "routine", label: "Ver rotina", screen: "9" },
  { section: "medicines", label: "Ver remédios", screen: "10" },
  { section: "wallet", label: "Ver carteira", screen: "11" },
] as const;

export function PetSectionHeader({
  title,
  active,
  onBack,
  onOpen,
}: {
  title: string;
  active: PetSection;
  onBack: () => void;
  onOpen?: (screen: string) => void;
}) {
  const { pet, updatePet } = usePetProfile();
  if (!pet) return null;

  return (
    <>
      <header className="pet-section-header">
        <button type="button" aria-label="Voltar" onClick={onBack}>
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={2.5} />
        </button>
        <h1>{title}</h1>
      </header>

      <section className="pet-context-card" aria-labelledby="pet-context-name">
        <PetPhotoPicker
          className="pet-context-card__photo"
          imageUrl={pet.photoUrl}
          imageAlt={`Foto do ${pet.name}`}
          inputPrefix="shared-pet-photo"
          onImageChange={(photoUrl) => updatePet({ photoUrl })}
        />
        <h2 id="pet-context-name">{pet.name}</h2>
        <div className="pet-context-card__facts">
          <span>{pet.breed}</span>
          <span>{pet.age}</span>
          <span>{pet.weight}</span>
        </div>
      </section>

      <nav className="pet-section-tabs" aria-label="Seções do perfil do pet">
        {tabs.map((tab) => (
          <button
            key={tab.section}
            type="button"
            aria-current={active === tab.section ? "page" : undefined}
            onClick={() => onOpen?.(tab.screen)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
