import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

const tasks = [
  {
    title: "08:00 • Alimentação",
    text: "Ração premium e água trocada para o Balu.",
    status: "Feito",
    note: "Confirmado por Leôncio hoje às 08:12.",
    done: true,
  },
  {
    title: "14:00 • Vermífugo Chemital",
    text: "1/2 comprimido via oral agendado para esta tarde.",
    status: "Hoje",
    done: false,
  },
  {
    title: "18:00 • Passeio diário",
    text: "Passeio curto no fim da tarde para manter a rotina.",
    status: "20 min",
    done: false,
  },
];
export type RoutineView = "today" | "weekly" | "bath" | "history";

const routineTabs = [
  ["Hoje", "9", "today"],
  ["Semanal", "9a", "weekly"],
  ["Banho", "9b", "bath"],
  ["Histórico", "9c", "history"],
] as const;

export function RoutineScreen({
  onBack,
  onOpen,
  view = "today",
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
  view?: RoutineView;
}) {
  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="routine-screen" data-figma-node="236:2">
        <header className="figma-pet-header">
          <button aria-label="Voltar" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1>Ver rotina</h1>
        </header>
        <section className="routine-pet-card">
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
          <button className="active" onClick={() => onOpen?.("9")}>
            Ver rotina
          </button>
          <button onClick={() => onOpen?.("10")}>Ver remédios</button>
          <button onClick={() => onOpen?.("11")}>Ver carteira</button>
        </nav>
        <nav className="routine-tabs">
          {routineTabs.map(([label, screen, tabView]) => (
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
        <RoutineContent onOpen={onOpen} view={view} />
        <button className="outline-action" onClick={() => onOpen?.("9e")} type="button">
          <img src="/assets/figma/pets/routine-add.svg" alt="" />
          Cadastrar nova rotina
        </button>
      </div>
    </MobileShell>
  );
}

function RoutineContent({
  view,
  onOpen,
}: {
  view: RoutineView;
  onOpen?: (screen: string) => void;
}) {
  if (view === "weekly") {
    return (
      <div className="routine-variant-list routine-weekly-list">
        <article>
          <div>
            <h3>Segunda-feira</h3>
            <span>3 cuidados</span>
          </div>
          <p>Alimentação às 08:00</p>
          <small>Vermífugo às 14:00</small>
          <small>Passeio diário às 18:00</small>
        </article>
        <article>
          <div>
            <h3>Terça-feira</h3>
            <span>2 cuidados</span>
          </div>
          <p>Alimentação às 08:00</p>
          <small>Passeio às 18:00</small>
        </article>
        <article>
          <div>
            <h3>Quarta-feira</h3>
            <span>3 cuidados</span>
          </div>
          <p>Alimentação às 08:00</p>
          <small>Escovação às 15:00</small>
          <small>Passeio diário às 18:00</small>
        </article>
      </div>
    );
  }

  if (view === "bath") {
    return (
      <div className="routine-variant-list routine-bath-list">
        <article className="is-featured">
          <div>
            <h3>Próximo banho</h3>
            <span>20 jul</span>
          </div>
          <p>Banho completo com hidratação e escovação.</p>
          <small>Faltam 5 dias</small>
        </article>
        <article>
          <div>
            <h3>Frequência</h3>
            <span>15 dias</span>
          </div>
          <p>Rotina recomendada para a pelagem do Balu.</p>
        </article>
        <article>
          <div>
            <h3>Último banho</h3>
            <span>Concluído</span>
          </div>
          <p>Realizado em 05 de julho por Leôncio.</p>
        </article>
      </div>
    );
  }

  if (view === "history") {
    return (
      <div className="routine-variant-list routine-history-list">
        <article>
          <div>
            <h3>Ontem</h3>
            <span>3 concluídos</span>
          </div>
          <p>Alimentação, vermífugo e passeio diário.</p>
          <small>Confirmado por Leôncio</small>
          <button type="button" onClick={() => onOpen?.("9d")}>
            Ver detalhes
          </button>
        </article>
        <article>
          <div>
            <h3>13 de julho</h3>
            <span>2 concluídos</span>
          </div>
          <p>Alimentação e passeio diário.</p>
          <button type="button" onClick={() => onOpen?.("9d")}>
            Ver detalhes
          </button>
        </article>
        <article>
          <div>
            <h3>12 de julho</h3>
            <span>3 concluídos</span>
          </div>
          <p>Alimentação, escovação e passeio diário.</p>
          <button type="button" onClick={() => onOpen?.("9d")}>
            Ver detalhes
          </button>
        </article>
      </div>
    );
  }

  return (
    <div className="routine-list">
      {tasks.map((task) => (
        <article className={`routine-item ${task.done ? "done" : ""}`} key={task.title}>
          <div>
            <h3>{task.title}</h3>
            <span>{task.status}</span>
          </div>
          <p>{task.text}</p>
          {task.note && <small>{task.note}</small>}
          {task.done ? (
            <b>Rotina diária</b>
          ) : (
            <button className="figma-checkbox" aria-label={task.title} type="button">
              <img src="/assets/figma/pets/routine-check.svg" alt="" />
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
