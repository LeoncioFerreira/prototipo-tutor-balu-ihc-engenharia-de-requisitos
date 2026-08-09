import { useState } from "react";
import { useErrorFeedback } from "../../../components/ui/error-feedback/ErrorFeedback";

type Props = {
  onEnter: () => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onGoogleUnavailable: () => void;
  onAppleUnavailable: () => void;
};

export function LoginScreen({
  onEnter,
  onCreateAccount,
  onForgotPassword,
  onGoogleUnavailable,
  onAppleUnavailable,
}: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ login?: string; password?: string }>({});
  const { showToast } = useErrorFeedback();

  return (
    <main className="login-screen">
      <section className="login-screen__canvas" data-figma-node="11:2">
        <header>
          <h1>Entrar no Balu</h1>
          <p>Acompanhe a saúde do seu pet com segurança</p>
        </header>

        <div className="login-screen__logo">
          <img src="/assets/figma/logo-balu.png" alt="Balu" />
        </div>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (!login.trim() || !password.trim()) {
              setErrors({
                login: login.trim() ? undefined : "Informe o e-mail.",
                password: password.trim() ? undefined : "Informe a senha.",
              });
              showToast("Preencha os campos obrigatórios para continuar.");
            } else if (login === "admin" && password === "123") {
              onEnter();
            } else {
              showToast("Coloque um e-mail e senha para entrar.");
            }
          }}
        >
          <div className="login-screen__form-heading">
            <strong>Login</strong>
            <small>* indica campo obrigatório</small>
          </div>
          <label>
            <span>
              E-mail{" "}
              <b className="login-screen__required" aria-hidden="true">
                *
              </b>
            </span>
            <input
              id="login-email"
              aria-label="E-mail"
              aria-invalid={Boolean(errors.login)}
              aria-describedby={errors.login ? "login-email-error" : undefined}
              required
              value={login}
              onChange={(event) => {
                setLogin(event.target.value);
                setErrors((current) => ({ ...current, login: undefined }));
              }}
              placeholder="voce@email.com"
              type="text"
            />
            {errors.login && (
              <small id="login-email-error" className="login-screen__error">
                {errors.login}
              </small>
            )}
          </label>
          <label>
            <span>
              Senha{" "}
              <b className="login-screen__required" aria-hidden="true">
                *
              </b>
            </span>
            <input
              id="login-password"
              aria-label="Senha"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
              }}
              placeholder="Digite sua senha"
              type="password"
            />
            {errors.password && (
              <small id="login-password-error" className="login-screen__error">
                {errors.password}
              </small>
            )}
          </label>
          <button className="login-screen__enter" type="submit">
            Entrar
          </button>
          <button className="login-screen__forgot" type="button" onClick={onForgotPassword}>
            Esqueceu sua senha?
          </button>
        </form>

        <div className="login-screen__account">
          <span>Não tem conta?</span>
          <button type="button" onClick={onCreateAccount}>
            Criar conta
          </button>
        </div>

        <div className="login-screen__divider">
          <i />
          <b>OU</b>
          <i />
        </div>

        <button className="login-screen__social" type="button" onClick={onGoogleUnavailable}>
          <span className="login-screen__google">G</span>
          Continuar com Google
        </button>
        <button className="login-screen__social" type="button" onClick={onAppleUnavailable}>
          <span className="login-screen__apple">
            <img src="/assets/figma/access/apple.svg" alt="" />
          </span>
          Continuar com Apple
        </button>
      </section>
    </main>
  );
}
