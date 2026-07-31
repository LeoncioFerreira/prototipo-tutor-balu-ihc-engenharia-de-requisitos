import { ExperienceScreen } from "../tela-04-escolha-experiencia/Screen";
export function GamifiedExperienceScreen({ onComplete }: { onComplete?: () => void }) {
  return <ExperienceScreen selectedChoice="gamified" onComplete={() => onComplete?.()} />;
}
