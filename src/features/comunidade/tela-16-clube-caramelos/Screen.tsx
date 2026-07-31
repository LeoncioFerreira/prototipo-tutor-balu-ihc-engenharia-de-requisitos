import { InformationScreen } from "../../../components/ui/InformationScreen";
export function CaramelClubScreen() {
  return (
    <InformationScreen
      title="Clube dos Caramelos"
      subtitle="Uma comunidade para trocar experiências"
      items={[
        { title: "Publicações", description: "Confira as conversas do clube" },
        { title: "Membros", description: "2,4 mil tutores" },
      ]}
      button="Entrar no clube"
    />
  );
}
