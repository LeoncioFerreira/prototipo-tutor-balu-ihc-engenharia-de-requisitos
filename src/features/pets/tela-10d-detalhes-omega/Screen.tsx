import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

export type MedicineHistoryDetail = {
  name: string;
  date: string;
  time: string;
  dose: string;
  route: string;
  responsible: string;
  confirmation: string;
  observation: string;
  status: "Concluído" | "Agendado";
};

const omegaDetail: MedicineHistoryDetail = {
  name: "Ômega 3",
  date: "12 de julho de 2026",
  time: "08:00",
  dose: "1 cápsula",
  route: "Via oral",
  responsible: "Leôncio",
  confirmation: "08:07",
  observation: "Administrado após a primeira refeição do dia.",
  status: "Concluído",
};

export function MedicineHistoryDetailScreen({
  detail,
  onBack,
}: {
  detail: MedicineHistoryDetail;
  onBack: () => void;
}) {
  const rows = [
    ["Data", detail.date],
    ["Horário", detail.time],
    ["Dose", detail.dose],
    ["Administração", detail.route],
    ["Responsável", detail.responsible],
    ["Confirmado às", detail.confirmation],
  ];

  return (
    <MobileShell active="pets" onNavigate={() => undefined}>
      <div className="medicine-history-detail-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h1>Detalhes do medicamento</h1>
        </header>

        <section className="medicine-history-detail-screen__medicine">
          <img src="/assets/figma/pets/medicine-icon.svg" alt="" />
          <div>
            <h2>{detail.name}</h2>
            <p>Registro concluído</p>
          </div>
          <span className={detail.status === "Agendado" ? "is-scheduled" : ""}>
            {detail.status}
          </span>
        </section>

        <section className="medicine-history-detail-screen__data">
          <h2>Informações da dose</h2>
          <dl>
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="medicine-history-detail-screen__observation">
          <h2>Observação</h2>
          <p>{detail.observation}</p>
        </section>
      </div>
    </MobileShell>
  );
}

export function OmegaHistoryDetailScreen({ onBack }: { onBack: () => void }) {
  return <MedicineHistoryDetailScreen detail={omegaDetail} onBack={onBack} />;
}
