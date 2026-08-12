import { ArrowLeft, Plus, X } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "../../../components/ui/MobileShell";
const controlFont = { fontFamily: '"Plus Jakarta Sans", Arial, sans-serif' };

const activities = [
  {
    asset: "activity-pill.svg",
    actor: "Paulo",
    action: "Deu Vermífugo Chemital",
    time: "Hoje às 14:05",
  },
  {
    asset: "activity-walk.svg",
    actor: "Leôncio",
    action: "Realizou Passeio Diário (20 min)",
    time: "Hoje às 18:30",
  },
  {
    asset: "activity-sync.svg",
    actor: "Sistema",
    action: "Clínica sincronizou vacina V10 Múltipla",
    time: "Hoje às 10:00",
  },
];
export function SharedCareScreen({
  onBack,
  onInvite,
}: {
  onBack: () => void;
  onInvite: () => void;
}) {
  const [caregivers, setCaregivers] = useState([
    { initial: "L", name: "Leôncio", isMain: true },
    { initial: "P", name: "Paulo", isMain: false },
    { initial: "A", name: "André", isMain: false },
  ]);

  const [caregiverToRemove, setCaregiverToRemove] = useState<string | null>(null);

  const confirmRemoveCaregiver = (nameToRemove: string) => {
    setCaregiverToRemove(nameToRemove);
  };

  const executeRemove = () => {
    if (caregiverToRemove) {
      setCaregivers((current) => current.filter((c) => c.name !== caregiverToRemove));
      setCaregiverToRemove(null);
    }
  };

  const cancelRemove = () => {
    setCaregiverToRemove(null);
  };

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="shared-care-screen">
        <header className="figma-pet-header">
          <button type="button" aria-label="Voltar" onClick={onBack} style={controlFont}>
            <ArrowLeft size={20} />
          </button>
          <h1>Cuidado Compartilhado</h1>
        </header>
        <section className="caregivers-section">
          <h2>Cuidadores de Balu</h2>
          <ul className="caregivers">
            {caregivers.map(({ initial, name, isMain }) => (
              <li key={name}>
                <div className="avatar-wrapper">
                  <span className={isMain ? "primary" : ""}>{initial}</span>
                  {!isMain && (
                    <button
                      type="button"
                      aria-label={`Remover ${name}`}
                      className="remove-caregiver"
                      onClick={() => confirmRemoveCaregiver(name)}
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                  )}
                </div>
                <b>{name}</b>
              </li>
            ))}
            <li>
              <button
                type="button"
                aria-label="Convidar tutor"
                onClick={onInvite}
                style={controlFont}
              >
                <span>
                  <Plus size={22} />
                </span>
                <b>Convidar</b>
              </button>
            </li>
          </ul>
        </section>
        <section className="history-section">
          <h2>Histórico de Atividades</h2>
          <ul className="activity-list">
            {activities.map(({ asset, actor, action, time }) => (
              <li key={`${actor}-${action}`}>
                <article>
                  <span>
                    <img
                      className={asset === "activity-pill.svg" ? "activity-list__pill-icon" : ""}
                      src={`/assets/figma/pets/${asset}`}
                      alt=""
                    />
                  </span>
                  <div>
                    <p className="activity-list__description">
                      <b>{actor}</b> <span aria-hidden="true">•</span> {action}
                    </p>
                    <p className="activity-list__time">{time}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {caregiverToRemove && (
          <div className="remove-modal-overlay">
            <div className="remove-modal">
              <h3>Remover cuidador</h3>
              <p>
                Tem certeza que deseja remover <b>{caregiverToRemove}</b> do cuidado compartilhado?
              </p>
              <div className="remove-modal-actions">
                <button type="button" className="btn-cancel" onClick={cancelRemove}>
                  Cancelar
                </button>
                <button type="button" className="btn-confirm" onClick={executeRemove}>
                  Remover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
