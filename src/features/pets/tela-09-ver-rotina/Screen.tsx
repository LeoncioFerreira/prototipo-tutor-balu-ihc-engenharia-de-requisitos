import { useState } from "react";
import { ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { PetDetailsButton } from "../../../components/ui/pet-details-button/PetDetailsButton";
import type { RoutineHistoryKey } from "../tela-09d-detalhes-historico/Screen";

type RoutineTask = {
  id: string;
  time: string;
  name: string;
  text: string;
  status: string;
  note?: string;
  done: boolean;
};

const initialTasks: RoutineTask[] = [
  {
    id: "food",
    time: "08:00",
    name: "Alimentação",
    text: "Ração premium e água trocada para o Balu.",
    status: "Feito",
    note: "Confirmado por Leôncio hoje às 08:12.",
    done: true,
  },
  {
    id: "dewormer",
    time: "14:00",
    name: "Vermífugo Chemital",
    text: "1/2 comprimido via oral agendado para esta tarde.",
    status: "Hoje",
    done: false,
  },
  {
    id: "walk",
    time: "18:00",
    name: "Passeio diário",
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
  onOpenHistoryDetail,
}: {
  onBack: () => void;
  onOpen?: (screen: string) => void;
  view?: RoutineView;
  onOpenHistoryDetail?: (record: RoutineHistoryKey) => void;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [editingTask, setEditingTask] = useState<RoutineTask | null>(null);
  const [removingTask, setRemovingTask] = useState<RoutineTask | null>(null);
  const [routineDetails, setRoutineDetails] = useState<{ label: string; lines: string[] } | null>(
    null,
  );

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
        <RoutineContent
          onEdit={setEditingTask}
          onDetails={(label, lines) => setRoutineDetails({ label, lines })}
          onOpenHistoryDetail={onOpenHistoryDetail}
          onRemove={setRemovingTask}
          tasks={tasks}
          view={view}
        />
        <button className="outline-action" onClick={() => onOpen?.("9e")} type="button">
          <img src="/assets/figma/pets/routine-add.svg" alt="" />
          Cadastrar nova rotina
        </button>
        {editingTask && (
          <RoutineEditDialog
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={(updated) => {
              setTasks((items) => items.map((item) => (item.id === updated.id ? updated : item)));
              setEditingTask(null);
            }}
          />
        )}
        {removingTask && (
          <div className="routine-dialog-backdrop">
            <section aria-label="Remover rotina" aria-modal="true" role="dialog">
              <button aria-label="Fechar" type="button" onClick={() => setRemovingTask(null)}>
                <X aria-hidden="true" size={18} />
              </button>
              <h2>Remover rotina</h2>
              <p>Deseja remover a rotina {removingTask.name}?</p>
              <div className="routine-dialog-actions">
                <button type="button" onClick={() => setRemovingTask(null)}>
                  Cancelar
                </button>
                <button
                  className="is-danger"
                  type="button"
                  onClick={() => {
                    setTasks((items) => items.filter((item) => item.id !== removingTask.id));
                    setRemovingTask(null);
                  }}
                >
                  Confirmar remoção
                </button>
              </div>
            </section>
          </div>
        )}
        {routineDetails && (
          <div className="routine-dialog-backdrop">
            <section
              aria-label={
                routineDetails.label === "próximo banho"
                  ? "Detalhes do próximo banho"
                  : `Detalhes de ${routineDetails.label}`
              }
              aria-modal="true"
              role="dialog"
            >
              <button aria-label="Fechar" type="button" onClick={() => setRoutineDetails(null)}>
                <X aria-hidden="true" size={18} />
              </button>
              <h2>{routineDetails.label}</h2>
              <ul className="routine-details-list">
                {routineDetails.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

function RoutineContent({
  view,
  tasks,
  onEdit,
  onRemove,
  onDetails,
  onOpenHistoryDetail,
}: {
  view: RoutineView;
  tasks: RoutineTask[];
  onEdit: (task: RoutineTask) => void;
  onRemove: (task: RoutineTask) => void;
  onDetails: (label: string, lines: string[]) => void;
  onOpenHistoryDetail?: (record: RoutineHistoryKey) => void;
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
          <PetDetailsButton
            aria-label="Ver detalhes de Segunda-feira"
            className="routine-detail-button"
            onClick={() =>
              onDetails("Segunda-feira", [
                "Alimentação às 08:00",
                "Vermífugo às 14:00",
                "Passeio diário às 18:00",
              ])
            }
          >
            Ver detalhes
          </PetDetailsButton>
        </article>
        <article>
          <div>
            <h3>Terça-feira</h3>
            <span>2 cuidados</span>
          </div>
          <p>Alimentação às 08:00</p>
          <small>Passeio às 18:00</small>
          <PetDetailsButton
            aria-label="Ver detalhes de Terça-feira"
            className="routine-detail-button"
            onClick={() => onDetails("Terça-feira", ["Alimentação às 08:00", "Passeio às 18:00"])}
          >
            Ver detalhes
          </PetDetailsButton>
        </article>
        <article>
          <div>
            <h3>Quarta-feira</h3>
            <span>3 cuidados</span>
          </div>
          <p>Alimentação às 08:00</p>
          <small>Escovação às 15:00</small>
          <small>Passeio diário às 18:00</small>
          <PetDetailsButton
            aria-label="Ver detalhes de Quarta-feira"
            className="routine-detail-button"
            onClick={() =>
              onDetails("Quarta-feira", [
                "Alimentação às 08:00",
                "Escovação às 15:00",
                "Passeio diário às 18:00",
              ])
            }
          >
            Ver detalhes
          </PetDetailsButton>
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
          <PetDetailsButton
            aria-label="Ver detalhes do próximo banho"
            className="routine-detail-button"
            onClick={() =>
              onDetails("próximo banho", [
                "Data: 20 de julho",
                "Serviço: Banho completo com hidratação e escovação",
                "Frequência: 15 dias",
                "Responsável: Leôncio",
              ])
            }
          >
            Ver detalhes
          </PetDetailsButton>
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
          <PetDetailsButton onClick={() => onOpenHistoryDetail?.("yesterday")}>
            Ver detalhes
          </PetDetailsButton>
        </article>
        <article>
          <div>
            <h3>13 de julho</h3>
            <span>2 concluídos</span>
          </div>
          <p>Alimentação e passeio diário.</p>
          <PetDetailsButton onClick={() => onOpenHistoryDetail?.("july-13")}>
            Ver detalhes
          </PetDetailsButton>
        </article>
        <article>
          <div>
            <h3>12 de julho</h3>
            <span>3 concluídos</span>
          </div>
          <p>Alimentação, escovação e passeio diário.</p>
          <PetDetailsButton onClick={() => onOpenHistoryDetail?.("july-12")}>
            Ver detalhes
          </PetDetailsButton>
        </article>
      </div>
    );
  }

  return (
    <div className="routine-list">
      {tasks.map((task) => (
        <article className={`routine-item ${task.done ? "done" : ""}`} key={task.id}>
          <div>
            <h3>
              {task.time} • {task.name}
            </h3>
            <span>{task.status}</span>
          </div>
          <p>{task.text}</p>
          {task.note && <small>{task.note}</small>}
          {!task.done && (
            <button
              className="figma-checkbox"
              aria-label={`${task.time} • ${task.name}`}
              type="button"
            >
              <img src="/assets/figma/pets/routine-check.svg" alt="" />
            </button>
          )}
          <div className="routine-item-actions">
            <button
              aria-label={`Editar rotina ${task.name}`}
              type="button"
              onClick={() => onEdit(task)}
            >
              <Pencil aria-hidden="true" size={15} />
              Editar
            </button>
            <button
              aria-label={`Remover rotina ${task.name}`}
              type="button"
              onClick={() => onRemove(task)}
            >
              <Trash2 aria-hidden="true" size={15} />
              Remover
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function RoutineEditDialog({
  task,
  onClose,
  onSave,
}: {
  task: RoutineTask;
  onClose: () => void;
  onSave: (task: RoutineTask) => void;
}) {
  const [name, setName] = useState(task.name);
  const [time, setTime] = useState(task.time);
  const [text, setText] = useState(task.text);

  return (
    <div className="routine-dialog-backdrop">
      <section aria-label="Editar rotina" aria-modal="true" role="dialog">
        <button aria-label="Fechar" type="button" onClick={onClose}>
          <X aria-hidden="true" size={18} />
        </button>
        <h2>Editar rotina</h2>
        <label>
          Nome da rotina
          <input
            aria-label="Nome da rotina"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Horário
          <input
            aria-label="Horário"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>
        <label>
          Descrição
          <textarea
            aria-label="Descrição"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <div className="routine-dialog-actions">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave({ ...task, name: name.trim(), time, text: text.trim() })}
          >
            Salvar alterações
          </button>
        </div>
      </section>
    </div>
  );
}
