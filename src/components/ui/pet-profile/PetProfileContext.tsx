import { createContext, useContext, useState, type ReactNode } from "react";

export type PetProfile = {
  name: string;
  breed: string;
  sex: string;
  birthDate: string;
  coatColor: string;
  coatType: string;
  age: string;
  weight: string;
  photoUrl: string;
};

const initialPet: PetProfile = {
  name: "Balu",
  breed: "Samoieda",
  sex: "Macho",
  birthDate: "2024-08-11",
  coatColor: "Branca",
  coatType: "Longa",
  age: "2 anos",
  weight: "22 kg",
  photoUrl: "/assets/figma/pets/pet-avatar.svg",
};

type PetProfileContextValue = {
  pet: PetProfile | null;
  updatePet: (updates: Partial<PetProfile>) => void;
  removePet: () => void;
};

const PetProfileContext = createContext<PetProfileContextValue | null>(null);

export function PetProfileProvider({ children }: { children: ReactNode }) {
  const [pet, setPet] = useState<PetProfile | null>(initialPet);

  return (
    <PetProfileContext.Provider
      value={{
        pet,
        updatePet: (updates) =>
          setPet((current) => (current ? { ...current, ...updates } : current)),
        removePet: () => setPet(null),
      }}
    >
      {children}
    </PetProfileContext.Provider>
  );
}

export function usePetProfile() {
  const context = useContext(PetProfileContext);
  if (!context) throw new Error("usePetProfile deve ser usado dentro de PetProfileProvider");
  return context;
}
