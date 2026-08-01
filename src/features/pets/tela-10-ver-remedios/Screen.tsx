import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

export type MedicineView = "now" | "upcoming" | "today" | "history";

type Medicine = {
  title: string;
  description: string;
  done: boolean;
  detailsScreen?: string;
  confirmation?: string;
};

const medicinesByView: Record<MedicineView, Medicine[]> = {
  now: [
    {
      title: "14:00 • Vermífugo Chemital",
      description: "Dar 1/2 comprimido via oral",
      done: false,
      detailsScreen: "10f",
    },
    {
      title: "18:30 • Prednisolona",
      description: "Dar 5 ml após a refeição",
      done: false,
      detailsScreen: "10e",
    },
    {
      title: "08:00 • Ômega 3",
      description: "1 cápsula",
      confirmation: "Feito por Leôncio",
      done: true,
      detailsScreen: "10d",
    },
  ],
  upcoming: [
    {
      title: "Amanhã • 08:00",
      description: "NexGard",
      confirmation: "1 comprimido após a refeição",
      done: false,
      detailsScreen: "10g",
    },
    {
      title: "Amanhã • 20:00",
      description: "Prednisolona",
      confirmation: "Dar 5 ml",
      done: false,
      detailsScreen: "10e",
    },
    {
      title: "Sexta • 09:00",
      description: "Ômega 3",
      confirmation: "1 cápsula",
      done: false,
      detailsScreen: "10d",
    },
  ],
  today: [
    {
      title: "Hoje • 08:00",
      description: "Ômega 3",
      confirmation: "Feito por Leôncio",
      done: true,
      detailsScreen: "10d",
    },
    {
      title: "Hoje • 14:00",
      description: "Vermífugo Chemital",
      confirmation: "1/2 comprimido",
      done: false,
      detailsScreen: "10f",
    },
    {
      title: "Hoje • 18:30",
      description: "Prednisolona",
      confirmation: "Dar 5 ml",
      done: false,
      detailsScreen: "10e",
    },
  ],
  history: [
    {
      title: "12 de julho • 08:00",
      description: "Ômega 3",
      confirmation: "Confirmado por Leôncio",
      done: true,
      detailsScreen: "10d",
    },
    {
      title: "11 de julho • 18:30",
      description: "Prednisolona",
      confirmation: "Confirmado por Leôncio",
      done: true,
      detailsScreen: "10e",
    },
    {
      title: "10 de julho • 14:00",
      description: "Vermífugo",
      confirmation: "Confirmado por Leôncio",
      done: true,
      detailsScreen: "10f",
    },
  ],
};

const medicineTabs = [
  ["Agora", "10", "now"],
  ["Próximos", "10a", "upcoming"],
  ["Hoje", "10b", "today"],
  ["Histórico", "10c", "history"],
] as const;

export function MedicinesScreen({
  onBack,
  onOpen,
  onOpenDetail,
  view = "now",
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
  onOpenDetail?: (screen: string) => void;
  view?: MedicineView;
}) {
  const [medicines, setMedicines] = useState(() =>
    medicinesByView[view].map((item) => ({ ...item })),
  );

  const completeMedicine = (title: string) => {
    setMedicines((items) =>
      items.map((item) => (item.title === title ? { ...item, done: true } : item)),
    );
  };

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="medicines-screen" data-figma-node="430:2">
        <header className="figma-pet-header">
          <button aria-label="Voltar" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1>Medicamentos do Pet</h1>
        </header>
        <section className="medicine-pet-card">
          <img src="/assets/figma/pets/pet-avatar.svg" alt="" />
          <h2>Balu</h2>
          <div className="pet-facts">
            <span>Samoieda</span>
            <span>2 anos</span>
            <span>22 kg</span>
          </div>
        </section>
        <nav className="destination-tabs">
          <button onClick={() => onOpen?.("8")}>Visão geral</button>
          <button onClick={() => onOpen?.("9")}>Ver rotina</button>
          <button className="active" onClick={() => onOpen?.("10")}>
            Ver remédios
          </button>
          <button onClick={() => onOpen?.("11")}>Ver carteira</button>
        </nav>
        <nav className="medicine-tabs">
          {medicineTabs.map(([label, screen, tabView]) => (
            <button
              className={view === tabView ? "active" : ""}
              key={screen}
              onClick={() => onOpen?.(screen)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="medicine-list">
          {medicines.map((medicine) => (
            <article className="medicine-card" key={medicine.title}>
              <img className="medicine-icon" src="/assets/figma/pets/medicine-icon.svg" alt="" />
              <div className="medicine-copy">
                <h3>{medicine.title}</h3>
                <p>{medicine.description}</p>
                {medicine.confirmation && <small>{medicine.confirmation}</small>}
                {medicine.detailsScreen ? (
                  <button
                    className="details-pill"
                    onClick={() => onOpenDetail?.(medicine.detailsScreen!)}
                    type="button"
                  >
                    Ver detalhes
                  </button>
                ) : (
                  <span className="details-pill">Ver detalhes</span>
                )}
              </div>
              {medicine.done ? (
                <span className="done-pill">Concluído</span>
              ) : (
                <button
                  aria-checked="false"
                  aria-label={`Confirmar ${medicine.title}`}
                  className="figma-checkbox"
                  onClick={() => completeMedicine(medicine.title)}
                  role="checkbox"
                  type="button"
                >
                  <img src="/assets/figma/pets/routine-check.svg" alt="" />
                </button>
              )}
            </article>
          ))}
        </div>
        <button className="outline-action" onClick={() => onOpen?.("10h")} type="button">
          <img src="/assets/figma/pets/medicine-add.svg" alt="" />
          Adicionar remédio
        </button>
      </div>
    </MobileShell>
  );
}
