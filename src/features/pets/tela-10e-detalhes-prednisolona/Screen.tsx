import {
  MedicineHistoryDetailScreen,
  type MedicineHistoryDetail,
} from "../tela-10d-detalhes-omega/Screen";

const detail: MedicineHistoryDetail = {
  name: "Prednisolona",
  date: "11 de julho de 2026",
  time: "18:30",
  dose: "5 ml",
  route: "Via oral",
  responsible: "Leôncio",
  confirmation: "18:36",
  observation: "Administrado após a refeição da noite.",
  status: "Concluído",
};

export function PrednisoloneHistoryDetailScreen({ onBack }: { onBack: () => void }) {
  return <MedicineHistoryDetailScreen detail={detail} onBack={onBack} />;
}
