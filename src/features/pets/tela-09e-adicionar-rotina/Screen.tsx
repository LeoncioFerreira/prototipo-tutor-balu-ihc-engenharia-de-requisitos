import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

export function AddRoutineScreen({ onBack }: { onBack: () => void }) {
  return (
    <MobileShell padded={false}>
      <div className="pet-add-form-screen">
        <header>
          <button aria-label="Voltar" onClick={onBack} type="button">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Adicionar rotina</h1>
            <p>Organize um novo cuidado para o Balu.</p>
          </div>
        </header>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onBack();
          }}
        >
          <p className="required-note">* indica campo obrigatório</p>
          <label>
            <span>
              Nome da rotina <b className="required-mark">*</b>
            </span>
            <input placeholder="Ex: Passeio diário" required />
          </label>
          <div className="form-row">
            <label>
              <span>
                Horário <b className="required-mark">*</b>
              </span>
              <input type="time" required />
            </label>
            <label>
              <span>
                Frequência <b className="required-mark">*</b>
              </span>
              <select defaultValue="diaria" required>
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="unica">Uma vez</option>
              </select>
            </label>
          </div>
          <label>
            Instruções
            <textarea placeholder="Descreva os cuidados necessários" rows={4} />
          </label>
          <button className="save-addition" type="submit">
            Salvar rotina
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
