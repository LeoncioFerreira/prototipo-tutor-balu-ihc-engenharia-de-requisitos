import {
  MedicineHistoryDetailScreen,
  type MedicineHistoryDetail,
} from "../tela-10d-detalhes-omega/Screen";

const detail: MedicineHistoryDetail = {
  name: "Vermífugo Chemital",
  date: "10 de julho de 2026",
  time: "14:00",
  dose: "1/2 comprimido",
  route: "Via oral",
  responsible: "Leôncio",
  confirmation: "14:05",
  observation: "Dose administrada sem intercorrências.",
  status: "Concluído",
};

export function DewormerHistoryDetailScreen({ onBack }: { onBack: () => void }) {
  return <MedicineHistoryDetailScreen detail={detail} onBack={onBack} />;
}
