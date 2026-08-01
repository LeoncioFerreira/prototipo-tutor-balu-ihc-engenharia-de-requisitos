import { HomeFrame } from "../HomeFrame";
import type { MainDestination } from "../../../components/ui/MobileShell";

export function TraditionalHomeScreen({
  onNavigate,
  onOpenNotifications,
  onOpenProfile,
  onAddPet,
}: {
  onNavigate?: (destination: MainDestination) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onAddPet?: () => void;
}) {
  return (
    <HomeFrame
      variant="5t"
      onNavigate={onNavigate}
      onOpenNotifications={onOpenNotifications}
      onOpenProfile={onOpenProfile}
      onAddPet={onAddPet}
    />
  );
}
