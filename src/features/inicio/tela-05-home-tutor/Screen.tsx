import { HomeFrame } from "../HomeFrame";
import type { MainDestination } from "../../../components/ui/MobileShell";

export function HomeTutorScreen({
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
      variant="5"
      onNavigate={onNavigate}
      onOpenNotifications={onOpenNotifications}
      onOpenProfile={onOpenProfile}
      onAddPet={onAddPet}
    />
  );
}
