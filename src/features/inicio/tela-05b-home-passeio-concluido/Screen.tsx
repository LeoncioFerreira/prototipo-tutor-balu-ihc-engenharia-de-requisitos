import { InformationScreen } from "../../../components/ui/InformationScreen";
export function HomeWalkDoneScreen() {
  return (
    <InformationScreen
      title="Cuidado concluído"
      subtitle="Passeio registrado"
      items={[{ title: "Passeio diário", description: "Meta diária concluída" }]}
    />
  );
}
