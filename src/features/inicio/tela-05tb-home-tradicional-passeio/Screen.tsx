import { InformationScreen } from "../../../components/ui/InformationScreen";
export function TraditionalHomeWalkScreen() {
  return (
    <InformationScreen
      title="Rotina atualizada"
      subtitle="Passeio concluído"
      items={[{ title: "Passeio diário", description: "Concluído" }]}
    />
  );
}
