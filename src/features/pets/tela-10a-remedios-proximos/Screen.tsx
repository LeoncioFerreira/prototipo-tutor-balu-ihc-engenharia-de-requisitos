import { MedicinesScreen } from "../tela-10-ver-remedios/Screen";

export function UpcomingMedicinesScreen({
  onBack,
  onOpen,
  onOpenDetail,
}: {
  onBack: () => void;
  onOpen: (screen: string) => void;
  onOpenDetail: (screen: string) => void;
}) {
  return (
    <MedicinesScreen onBack={onBack} onOpen={onOpen} onOpenDetail={onOpenDetail} view="upcoming" />
  );
}
