import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { MobileShell, type MainDestination } from "../../components/ui/MobileShell";

export type HomeVariant = "5" | "5a" | "5b" | "5t" | "5ta" | "5tb";

type Props = {
  variant: HomeVariant;
  onNavigate?: (destination: MainDestination) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onAddPet?: () => void;
};

const variantCopy: Record<
  HomeVariant,
  { level?: string; status?: string; careTitle?: string; careBody?: string; careBadge?: string }
> = {
  "5": { level: "Nível 3", status: "Faltam 45 XP para o Nível 4" },
  "5a": { level: "Nível 3", status: "Faltam 20 XP para o Nível 4" },
  "5b": { level: "Nível 4", status: "Parabéns! Você evoluiu de nível" },
  "5t": {
    careTitle: "Vermífugo às 14:00",
    careBody: "Dar 1/2 comprimido via oral",
    careBadge: "Hoje",
  },
  "5ta": {
    careTitle: "Passeio diário às 18:00",
    careBody: "Meta diária: 20 min de caminhada",
    careBadge: "Hoje",
  },
  "5tb": {
    careTitle: "Próxima vacina em agosto",
    careBody: "Carteira atualizada e rotina do dia concluída",
    careBadge: "Depois",
  },
};

export function HomeFrame({
  variant,
  onNavigate = () => undefined,
  onOpenNotifications,
  onOpenProfile,
  onAddPet,
}: Props) {
  const [medicineDone, setMedicineDone] = useState(
    variant === "5a" || variant === "5b" || variant === "5tb",
  );
  const [walkDone, setWalkDone] = useState(variant === "5b" || variant === "5tb");
  const [lastCompleted, setLastCompleted] = useState<"medicine" | "walk" | null>(null);
  const displayVariant: HomeVariant =
    variant === "5" || variant === "5a" || variant === "5b"
      ? walkDone
        ? "5b"
        : medicineDone
          ? "5a"
          : "5"
      : variant;
  const copy = variantCopy[displayVariant];
  const gamified = displayVariant === "5" || displayVariant === "5a" || displayVariant === "5b";
  const level = displayVariant === "5b" ? 4 : 3;
  const progress = displayVariant === "5" ? 51 : displayVariant === "5a" ? 80 : 0;

  return (
    <MobileShell active="home" onNavigate={onNavigate}>
      <div className="balu-home" data-figma-node={homeNode(displayVariant)}>
        <header className="balu-home__header">
          <div className="balu-home__user">
            <button
              className="balu-home__user-avatar"
              type="button"
              aria-label="Abrir perfil do tutor"
              onClick={onOpenProfile}
            >
              L
            </button>
            <div>
              <small>Bom dia!</small>
              <h1>Olá, Leôncio!</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className="balu-home__emergency"
              type="button"
              aria-label="Emergência"
              onClick={() => onNavigate?.("chat")}
              style={{
                display: "grid",
                placeItems: "center",
                width: "48px",
                height: "48px",
                border: "1px solid #fed7d7",
                borderRadius: "50%",
                background: "#fff5f5",
                color: "#e53e3e",
                cursor: "pointer",
              }}
            >
              <TriangleAlert size={20} />
            </button>
            <button
              className="balu-home__bell"
              type="button"
              aria-label="Notificações"
              onClick={onOpenNotifications}
            >
              <img
                className="balu-home__bell-background"
                src="/assets/figma/home/notification-bell-background.svg"
                alt=""
              />
              <span className="balu-home__bell-dome" />
              <span className="balu-home__bell-base" />
              <span className="balu-home__bell-split" />
              <img
                className="balu-home__bell-clapper"
                src="/assets/figma/home/notification-bell-clapper.svg"
                alt=""
              />
              <b>1</b>
            </button>
          </div>
        </header>

        <section className="balu-home__pets" aria-label="Seletor de pets">
          <Pet asset="11.svg" name="Balu" selected />
          <Pet asset="09.svg" name="Pipoca" />
          <Pet asset="09.svg" name="Pretinha" />
          <Pet asset="06.svg" name="Adicionar" onClick={onAddPet} />
        </section>

        {gamified ? (
          <section className="balu-home__status balu-home__xp">
            <img
              src={
                level === 4
                  ? "/assets/figma/home/xp-level-4-badge.png"
                  : "/assets/figma/home/xp-level-badge.png"
              }
              alt={`Medalha do nível ${level}`}
            />
            <div>
              <strong>{copy.level}</strong>
              <p>{copy.status}</p>
              <span
                className="balu-home__progress"
                role="progressbar"
                aria-label={`Progresso do nível ${level}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <i style={{ width: `${progress}%` }} />
              </span>
            </div>
          </section>
        ) : (
          <section className="balu-home__status balu-home__next-care">
            <img
              src={
                displayVariant === "5tb" ? "/assets/figma/home/14.svg" : "/assets/figma/home/08.svg"
              }
              alt=""
            />
            <div>
              <strong>Próximo cuidado</strong>
              <h2>{copy.careTitle}</h2>
              <p>{copy.careBody}</p>
            </div>
            <span>{copy.careBadge}</span>
          </section>
        )}

        <section className="balu-home__routine">
          <h2>
            Rotina de hoje
            <span style={{ display: "block", fontSize: "12px", color: "#718096", fontWeight: 500, marginTop: "4px" }}>
              Conclua as atividades abaixo para cuidar do pet e ganhar pontos
            </span>
          </h2>
          {lastCompleted && (
            <div role="status" className="balu-home__undo">
              Cuidado concluído.
              <button
                type="button"
                onClick={() => {
                  if (lastCompleted === "medicine") setMedicineDone(false);
                  if (lastCompleted === "walk") setWalkDone(false);
                  setLastCompleted(null);
                }}
              >
                Desfazer
              </button>
            </div>
          )}
          <div className="balu-home__tasks">
            <Task
              icon="08.svg"
              title="08:00 • Alimentação"
              description="Ração Seca Premier"
              secondary="Feito por Leôncio"
              done
              featured
            />
            <Task
              icon="08.svg"
              title="14:00 • Vermífugo Chemital"
              description="Dar 1/2 comprimido via oral"
              done={medicineDone}
              label="Vermífugo Chemital"
              onToggle={() => {
                setMedicineDone(true);
                setLastCompleted("medicine");
              }}
            />
            <Task
              icon="14.svg"
              title="18:00 • Passeio Diário"
              description="Meta diária: 20 min de caminhada"
              done={walkDone}
              label="Passeio Diário"
              onToggle={() => {
                setWalkDone(true);
                setLastCompleted("walk");
              }}
            />
          </div>
        </section>
      </div>
    </MobileShell>
  );
}

function Pet({
  asset,
  name,
  selected = false,
  onClick,
}: {
  asset: string;
  name: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={selected ? "is-selected" : ""} onClick={onClick}>
      <img src={`/assets/figma/home/${asset}`} alt="" />
      <span>{name}</span>
    </button>
  );
}

function Task({
  icon,
  title,
  description,
  secondary,
  done = false,
  label,
  onToggle,
  featured = false,
}: {
  icon: string;
  title: string;
  description: string;
  secondary?: string;
  done?: boolean;
  label?: string;
  onToggle?: () => void;
  featured?: boolean;
}) {
  return (
    <article className={`balu-home__task ${featured ? "is-featured" : ""}`}>
      <img src={`/assets/figma/home/${icon}`} alt="" />
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
        {secondary && <small>{secondary}</small>}
      </div>
      {done ? (
        <span className="balu-home__done">Concluído</span>
      ) : (
        <button
          type="button"
          role="checkbox"
          aria-checked="false"
          aria-label={label}
          onClick={onToggle}
        >
          <img src="/assets/figma/home/15.svg" alt="" />
        </button>
      )}
    </article>
  );
}

function homeNode(variant: HomeVariant) {
  return {
    "5": "18:2",
    "5a": "287:2",
    "5b": "349:295",
    "5t": "361:2",
    "5ta": "363:2",
    "5tb": "363:143",
  }[variant];
}
