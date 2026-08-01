import { RoutineScreen } from "../tela-09-ver-rotina/Screen";

export function RoutineHistoryScreen({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen: (screen: string) => void;
}) {
  return <RoutineScreen onBack={onBack} onOpen={onOpen} view="history" />;
}
