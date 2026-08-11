import { RoutineScreen } from "../tela-09-ver-rotina/Screen";
import type { RoutineHistoryKey } from "../tela-09d-detalhes-historico/Screen";

export function RoutineHistoryScreen({
  onBack,
  onOpen,
  onOpenHistoryDetail,
}: {
  onBack: () => void;
  onOpen: (screen: string) => void;
  onOpenHistoryDetail: (record: RoutineHistoryKey) => void;
}) {
  return (
    <RoutineScreen
      onBack={onBack}
      onOpen={onOpen}
      onOpenHistoryDetail={onOpenHistoryDetail}
      view="history"
    />
  );
}
