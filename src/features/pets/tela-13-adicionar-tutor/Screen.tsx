import { InformationScreen } from "../../../components/ui/InformationScreen";
export function AddTutorScreen() {
  return (
    <InformationScreen
      title="Adicionar tutor"
      subtitle="Convide alguém para cuidar junto"
      items={[{ title: "E-mail do tutor", description: "O convite será enviado por e-mail" }]}
      button="Enviar convite"
    />
  );
}
