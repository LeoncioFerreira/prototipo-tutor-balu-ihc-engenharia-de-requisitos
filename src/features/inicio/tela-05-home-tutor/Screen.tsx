import { InformationScreen } from "../../../components/ui/InformationScreen";
export function HomeTutorScreen() {
  return (
    <InformationScreen
      title="Início"
      subtitle="Rotina do Balu"
      items={[
        { title: "Rotina de hoje", description: "3 cuidados programados" },
        { title: "Nível 3", description: "Continue cuidando para ganhar XP" },
      ]}
    />
  );
}
