import { RegisterPetScreen } from "../../acesso/tela-03-cadastrar-pet/Screen";
import { usePetProfile } from "../../../components/ui/pet-profile/PetProfileContext";

export function AddPetScreen({
  onBack,
  onComplete,
  editing = false,
}: {
  onBack: () => void;
  onComplete?: () => void;
  editing?: boolean;
}) {
  if (!editing) {
    return <RegisterPetScreen onBack={onBack} onComplete={onComplete} showProgress={false} />;
  }

  return <EditPetForm onBack={onBack} onComplete={onComplete} />;
}

function EditPetForm({ onBack, onComplete }: { onBack: () => void; onComplete?: () => void }) {
  const { pet, updatePet } = usePetProfile();
  return (
    <RegisterPetScreen
      onBack={onBack}
      onComplete={onComplete}
      showProgress={false}
      editing
      initialValues={pet ?? undefined}
      onSave={(fields) => updatePet(fields)}
      photoUrl={pet?.photoUrl}
      onPhotoChange={(photoUrl) => updatePet({ photoUrl })}
    />
  );
}
