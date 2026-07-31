import { InformationScreen } from "../../../components/ui/InformationScreen";
export function HomeMedicineDoneScreen() {
  return (
    <InformationScreen
      title="Cuidado concluído"
      subtitle="Vermífugo registrado"
      items={[{ title: "Vermífugo Chemital", description: "Concluído às 14:00" }]}
    />
  );
}
