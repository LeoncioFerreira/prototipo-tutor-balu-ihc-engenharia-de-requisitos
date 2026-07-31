import { InformationScreen } from "../../../components/ui/InformationScreen";
export function AddPetScreen() {
  return (
    <InformationScreen
      title="Adicionar pet"
      subtitle="Cadastre mais um companheiro"
      items={[{ title: "Dados básicos", description: "Nome, espécie e raça" }]}
      button="Cadastrar pet"
    />
  );
}
