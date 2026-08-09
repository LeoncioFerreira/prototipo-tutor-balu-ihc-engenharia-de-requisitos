import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { MobileShell } from "../../../components/ui/MobileShell";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

export type ExperienceMode = "traditional" | "gamified";

export function AccountSettingsScreen({
  experience,
  onBack,
  onChooseExperience,
  onChangeEmail,
  onChangePassword,
  fontLevel,
  onFontLevelChange,
}: {
  experience: ExperienceMode;
  onBack: () => void;
  onChooseExperience: () => void;
  onChangeEmail: () => void;
  onChangePassword: () => void;
  fontLevel: number;
  onFontLevelChange: (level: number) => void;
}) {
  const [googleLinked, setGoogleLinked] = useState(
    () => localStorage.getItem("balu-google-linked") === "true",
  );
  const [appleLinked, setAppleLinked] = useState(
    () => localStorage.getItem("balu-apple-linked") === "true",
  );
  const { showToast, showModal } = useErrorFeedback();

  const toggleProvider = (provider: "Google" | "Apple", linked: boolean) => {
    const key = `balu-${provider.toLowerCase()}-linked`;
    const update = (next: boolean) => {
      localStorage.setItem(key, String(next));
      if (provider === "Google") setGoogleLinked(next);
      else setAppleLinked(next);
      showToast(`Conta ${provider} ${next ? "vinculada" : "desvinculada"} com sucesso.`, "success");
    };
    if (!linked) {
      update(true);
      return;
    }
    showModal({
      title: `Desvincular ${provider}`,
      message: `Você poderá vincular sua conta ${provider} novamente quando quiser.`,
      action: { label: "Desvincular", onClick: () => update(false) },
    });
  };
  return (
    <MobileShell active="home" onNavigate={() => undefined}>
      <div className="account-settings-screen">
        <header>
          <button type="button" aria-label="Voltar" onClick={onBack}>
            ←
          </button>
          <div>
            <h1>Configurações da conta</h1>
            <p>Gerencie seus dados e preferências no Balu.</p>
          </div>
        </header>

        <section className="account-settings-screen__profile">
          <span>L</span>
          <div>
            <strong>Leôncio</strong>
            <p>Conta do tutor principal</p>
          </div>
        </section>

        <section className="account-settings-screen__group">
          <h2>Segurança e acesso</h2>
          <button type="button" aria-label="Alterar e-mail" onClick={onChangeEmail}>
            <span>
              <Mail aria-hidden="true" size={19} />
            </span>
            <span>
              <strong>Alterar e-mail</strong>
              <small>Atualize seu e-mail de acesso</small>
            </span>
            <b>›</b>
          </button>
          <button type="button" aria-label="Alterar senha" onClick={onChangePassword}>
            <span>
              <LockKeyhole aria-hidden="true" size={19} />
            </span>
            <span>
              <strong>Alterar senha</strong>
              <small>Crie uma nova senha segura</small>
            </span>
            <b>›</b>
          </button>
        </section>

        <section className="account-settings-screen__group">
          <h2>Contas vinculadas</h2>
          <button
            type="button"
            aria-label={`${googleLinked ? "Desvincular" : "Vincular"} Google`}
            onClick={() => toggleProvider("Google", googleLinked)}
          >
            <span>G</span>
            <span>
              <strong>Google</strong>
              <small>{googleLinked ? "Vinculada" : "Não vinculada"}</small>
            </span>
            <b>{googleLinked ? "Desvincular" : "Vincular"}</b>
          </button>
          <button
            type="button"
            aria-label={`${appleLinked ? "Desvincular" : "Vincular"} Apple`}
            onClick={() => toggleProvider("Apple", appleLinked)}
          >
            <span className="account-settings-screen__provider-icon is-apple">
              <img src="/assets/figma/access/apple.svg" alt="" />
            </span>
            <span>
              <strong>Apple</strong>
              <small>{appleLinked ? "Vinculada" : "Não vinculada"}</small>
            </span>
            <b>{appleLinked ? "Desvincular" : "Vincular"}</b>
          </button>
        </section>

        <section className="account-settings-screen__preferences">
          <h2>Preferências</h2>
          <button type="button" aria-label="Alterar experiência" onClick={onChooseExperience}>
            <span className="account-settings-screen__preference-icon">
              <img src="/assets/figma/inicio/settings-icon.svg" alt="" />
            </span>
            <span>
              <strong>Experiência do aplicativo</strong>
              <small>{experience === "traditional" ? "Tradicional" : "Gamificada"}</small>
            </span>
            <b>›</b>
          </button>
        </section>

        <section className="account-settings-screen__accessibility">
          <h2>Acessibilidade</h2>
          <div>
            <strong>Tamanho da fonte</strong>
            <small>Nível {fontLevel} de 5</small>
            <div className="account-settings-screen__font-control">
              <button
                type="button"
                aria-label="Diminuir fonte"
                disabled={fontLevel === 1}
                onClick={() => onFontLevelChange(fontLevel - 1)}
              >
                A−
              </button>
              <input
                aria-label="Tamanho da fonte"
                type="range"
                min="1"
                max="5"
                step="1"
                value={fontLevel}
                onChange={(event) => onFontLevelChange(Number(event.target.value))}
              />
              <button
                type="button"
                aria-label="Aumentar fonte"
                disabled={fontLevel === 5}
                onClick={() => onFontLevelChange(fontLevel + 1)}
              >
                A+
              </button>
            </div>
            <p>Este texto mostra uma prévia do tamanho escolhido.</p>
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
