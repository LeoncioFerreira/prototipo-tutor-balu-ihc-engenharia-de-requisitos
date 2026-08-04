import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";

export function AddMedicineScreen({ onBack }: { onBack: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <MobileShell padded={false}>
      <div className="pet-add-form-screen">
        <header>
          <button
            aria-label="Voltar"
            onClick={onBack}
            type="button"
            style={{ minWidth: 44, minHeight: 44 }}
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Adicionar remédio</h1>
            <p>Cadastre a medicação e os horários do Balu.</p>
          </div>
        </header>
        {saved && (
          <div role="status" className="addition-success">
            ✓ Remédio salvo com sucesso! Retornando...
          </div>
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
            setTimeout(onBack, 1200);
          }}
        >
          <p className="required-note">* indica campo obrigatório</p>
          <label>
            <span>
              Nome do remédio <b className="required-mark">*</b>
            </span>
            <input placeholder="Ex: Vermífugo Chemital" required />
          </label>
          <label>
            <span>
              Dose <b className="required-mark">*</b>
            </span>
            <input placeholder="Ex: 1/2 comprimido" required />
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
            Orientações
            <textarea placeholder="Ex: Dar após a refeição" rows={3} />
          </label>
          <button className="save-addition" type="submit">
            Salvar remédio
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
