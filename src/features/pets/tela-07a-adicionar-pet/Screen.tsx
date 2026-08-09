import { RegisterPetScreen } from "../../acesso/tela-03-cadastrar-pet/Screen";

export function AddPetScreen({
  onBack,
  onComplete,
}: {
  onBack: () => void;
  onComplete?: () => void;
}) {
  return <RegisterPetScreen onBack={onBack} onComplete={onComplete} showProgress={false} />;
}
