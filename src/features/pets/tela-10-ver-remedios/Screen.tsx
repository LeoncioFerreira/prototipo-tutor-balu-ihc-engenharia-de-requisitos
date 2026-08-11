import { useState } from "react";
import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PetDetailsButton } from "../../../components/ui/pet-details-button/PetDetailsButton";

export type MedicineView = "now" | "upcoming" | "today" | "history";

type Medicine = {
  title: string;
  description: string;
  done: boolean;
  detailsScreen?: string;
  confirmation?: string;
  origin?: "tutor" | "clinic";
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
  const [medicines, setMedicines] = useState<Medicine[]>(() =>
    medicinesByView[view].map((item) => ({
      ...item,
      origin: medicineName(item) === "Prednisolona" ? "clinic" : "tutor",
    })),
  );
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [removingMedicine, setRemovingMedicine] = useState<Medicine | null>(null);

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
        <p className="medicine-safety-note">
          Por segurança, medicamentos cadastrados pela clínica não podem ser editados nem removidos.
        </p>
        <div className="medicine-list">
          {medicines.map((medicine) => (
            <article
              className={`medicine-card ${medicine.origin === "clinic" ? "is-clinic" : ""}`}
              key={medicine.title}
            >
              <div className="medicine-card-header">
                <div className="medicine-copy">
                  <h3>{medicine.title}</h3>
                  <p>{medicine.description}</p>
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
              </div>
              <div className="medicine-card-meta">
                <span className={`medicine-origin is-${medicine.origin}`}>
                  {medicine.origin === "clinic" ? "Cadastrado pela clínica" : "Cadastrado por você"}
                </span>
                {medicine.confirmation && <small>{medicine.confirmation}</small>}
              </div>
              <div className="medicine-card-footer">
                {medicine.detailsScreen ? (
                  <PetDetailsButton
                    className="details-pill"
                    onClick={() => onOpenDetail?.(medicine.detailsScreen!)}
                  />
                ) : (
                  <PetDetailsButton asSpan className="details-pill" />
                )}
                {medicine.origin === "tutor" && (
                  <>
                    <button
                      aria-label={`Editar remédio ${medicineName(medicine)}`}
                      type="button"
                      onClick={() => setEditingMedicine(medicine)}
                    >
                      <Pencil aria-hidden="true" size={14} />
                      Editar
                    </button>
                    <button
                      aria-label={`Remover remédio ${medicineName(medicine)}`}
                      type="button"
                      onClick={() => setRemovingMedicine(medicine)}
                    >
                      <Trash2 aria-hidden="true" size={14} />
                      Remover
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <button className="outline-action" onClick={() => onOpen?.("10h")} type="button">
          <img src="/assets/figma/pets/medicine-add.svg" alt="" />
          Adicionar remédio
        </button>
        {editingMedicine && (
          <MedicineEditDialog
            medicine={editingMedicine}
            onClose={() => setEditingMedicine(null)}
            onSave={(updated) => {
              setMedicines((items) =>
                items.map((item) => (item === editingMedicine ? updated : item)),
              );
              setEditingMedicine(null);
            }}
          />
        )}
        {removingMedicine && (
          <div className="medicine-dialog-backdrop">
            <section aria-label="Remover remédio" aria-modal="true" role="dialog">
              <button aria-label="Fechar" type="button" onClick={() => setRemovingMedicine(null)}>
                <X aria-hidden="true" size={18} />
              </button>
              <h2>Remover remédio</h2>
              <p>Deseja remover {medicineName(removingMedicine)}?</p>
              <div className="medicine-dialog-actions">
                <button type="button" onClick={() => setRemovingMedicine(null)}>
                  Cancelar
                </button>
                <button
                  className="is-danger"
                  type="button"
                  onClick={() => {
                    setMedicines((items) => items.filter((item) => item !== removingMedicine));
                    setRemovingMedicine(null);
                  }}
                >
                  Confirmar remoção
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function medicineName(medicine: Medicine) {
  if (
    medicine.title.includes(" • ") &&
    !medicine.title.startsWith("Amanhã") &&
    !medicine.title.startsWith("Hoje")
  ) {
    const trailing = medicine.title.split(" • ").slice(1).join(" • ");
    if (/\d{2}:\d{2}/.test(trailing)) return medicine.description;
    return trailing;
  }
  return medicine.description;
}

function MedicineEditDialog({
  medicine,
  onClose,
  onSave,
}: {
  medicine: Medicine;
  onClose: () => void;
  onSave: (medicine: Medicine) => void;
}) {
  const currentName = medicineName(medicine);
  const [name, setName] = useState(currentName);
  const [dose, setDose] = useState(
    medicine.title.endsWith(currentName) ? medicine.description : (medicine.confirmation ?? ""),
  );

  const save = () => {
    const title = medicine.title.endsWith(currentName)
      ? `${medicine.title.slice(0, -currentName.length)}${name.trim()}`
      : medicine.title;
    onSave({
      ...medicine,
      title,
      description: medicine.title.endsWith(currentName) ? dose.trim() : name.trim(),
      confirmation: medicine.title.endsWith(currentName) ? medicine.confirmation : dose.trim(),
    });
  };

  return (
    <div className="medicine-dialog-backdrop">
      <section aria-label="Editar remédio" aria-modal="true" role="dialog">
        <button aria-label="Fechar" type="button" onClick={onClose}>
          <X aria-hidden="true" size={18} />
        </button>
        <h2>Editar remédio</h2>
        <label>
          Nome do medicamento
          <input
            aria-label="Nome do medicamento"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Dose e orientação
          <input
            aria-label="Dose e orientação"
            value={dose}
            onChange={(event) => setDose(event.target.value)}
          />
        </label>
        <div className="medicine-dialog-actions">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" onClick={save}>
            Salvar alterações
          </button>
        </div>
      </section>
    </div>
  );
}
