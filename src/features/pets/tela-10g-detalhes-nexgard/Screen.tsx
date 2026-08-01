import {
  MedicineHistoryDetailScreen,
  type MedicineHistoryDetail,
} from "../tela-10d-detalhes-omega/Screen";

const detail: MedicineHistoryDetail = {
  name: "NexGard",
  date: "Próxima dose",
  time: "08:00",
  dose: "1 comprimido",
  route: "Via oral",
  responsible: "Leôncio",
  confirmation: "Pendente",
  observation: "Administrar após a primeira refeição do dia.",
  status: "Agendado",
};

export function NexGardDetailScreen({ onBack }: { onBack: () => void }) {
  return <MedicineHistoryDetailScreen detail={detail} onBack={onBack} />;
}
