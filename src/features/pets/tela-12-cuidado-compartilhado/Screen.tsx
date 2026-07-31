import { InformationScreen } from "../../../components/ui/InformationScreen";
export function SharedCareScreen() {
  return (
    <InformationScreen
      title="Cuidado compartilhado"
      subtitle="Pessoas que cuidam do Balu"
      items={[
        { title: "Leôncio", description: "Tutor principal" },
        { title: "Adicionar tutor", description: "Compartilhe os cuidados" },
      ]}
      button="Convidar tutor"
    />
  );
}
