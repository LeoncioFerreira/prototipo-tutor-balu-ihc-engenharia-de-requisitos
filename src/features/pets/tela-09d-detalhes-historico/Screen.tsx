import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

export type RoutineHistoryKey = "yesterday" | "july-13" | "july-12";

type Period = {
  name: string;
  time: string;
  title: string;
  description: string;
  responsible: string;
};
const historyRecords: Record<RoutineHistoryKey, { label: string; periods: Period[] }> = {
  yesterday: {
    label: "Ontem",
    periods: [
      {
        name: "Manhã",
        time: "08:00",
        title: "Alimentação",
        description: "Ração premium servida e água trocada.",
        responsible: "Confirmado por Leôncio às 08:12",
      },
      {
        name: "Tarde",
        time: "14:00",
        title: "Vermífugo Chemital",
        description: "1/2 comprimido administrado por via oral.",
        responsible: "Confirmado por Leôncio às 14:06",
      },
      {
        name: "Noite",
        time: "18:00",
        title: "Passeio diário",
        description: "Passeio de 20 minutos concluído.",
        responsible: "Confirmado por Leôncio às 18:24",
      },
    ],
  },
  "july-13": {
    label: "13 de julho",
    periods: [
      {
        name: "Manhã",
        time: "08:00",
        title: "Alimentação",
        description: "Ração premium servida e água trocada.",
        responsible: "Confirmado por Leôncio às 08:10",
      },
      {
        name: "Noite",
        time: "18:00",
        title: "Passeio diário",
        description: "Passeio de 20 minutos concluído.",
        responsible: "Confirmado por Leôncio às 18:20",
      },
    ],
  },
  "july-12": {
    label: "12 de julho",
    periods: [
      {
        name: "Manhã",
        time: "08:00",
        title: "Alimentação",
        description: "Ração premium servida e água trocada.",
        responsible: "Confirmado por Leôncio às 08:09",
      },
      {
        name: "Tarde",
        time: "15:00",
        title: "Escovação",
        description: "Pelagem escovada com cuidado.",
        responsible: "Confirmado por Leôncio às 15:15",
      },
      {
        name: "Noite",
        time: "18:00",
        title: "Passeio diário",
        description: "Passeio de 20 minutos concluído.",
        responsible: "Confirmado por Leôncio às 18:22",
      },
    ],
  },
};

export function RoutineHistoryDetailsScreen({
  onBack,
  recordKey = "yesterday",
}: {
  onBack: () => void;
  recordKey?: RoutineHistoryKey;
}) {
  const record = historyRecords[recordKey];
  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="routine-history-details-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1>Detalhes do histórico</h1>
        </header>
        <section className="routine-history-details-screen__summary">
          <div>
            <strong>{record.label}</strong>
            <span>Concluído</span>
          </div>
          <p>{record.periods.length} cuidados realizados na rotina do Balu.</p>
        </section>
        <div className="routine-history-details-screen__periods">
          {record.periods.map((period) => (
            <section key={period.name}>
              <h2>{period.name}</h2>
              <article>
                <time>{period.time}</time>
                <div>
                  <strong>{period.title}</strong>
                  <p>{period.description}</p>
                  <small>{period.responsible}</small>
                </div>
                <span>Feito</span>
              </article>
            </section>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
