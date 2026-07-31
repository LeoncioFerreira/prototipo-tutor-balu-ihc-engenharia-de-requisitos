import { InformationScreen } from "../../../components/ui/InformationScreen";
export function TraditionalHomeMedicineScreen() {
  return (
    <InformationScreen
      title="Rotina atualizada"
      subtitle="Vermífugo concluído"
      items={[{ title: "Vermífugo Chemital", description: "Concluído" }]}
    />
  );
}
