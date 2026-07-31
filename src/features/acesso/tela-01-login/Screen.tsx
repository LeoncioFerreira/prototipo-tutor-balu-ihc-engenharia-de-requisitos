import { useState } from "react";

type Props = {
  onEnter: () => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
  onProvider: (provider: "Google" | "Apple") => void;
};

export function LoginScreen({ onEnter, onCreateAccount, onForgotPassword, onProvider }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return (
    <main className="h-[100dvh] overflow-hidden bg-[#202124]">
      <section className="mx-auto h-full w-full max-w-[393px] overflow-y-auto bg-white px-5 py-10 text-[#002045]">
        <header className="space-y-1">
          <h1 className="text-[24px] font-extrabold leading-none">Entrar no Balu</h1>
          <p className="w-[260px] text-[14px] font-medium text-[#4a5568]">
            Acompanhe a saúde do seu pet com segurança
          </p>
        </header>
        <div className="flex h-[157px] items-center justify-center">
          <img
            className="h-[157px] w-[210px] object-contain"
            src="/assets/figma/logo-balu.png"
            alt="Balu"
          />
        </div>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (login === "admin" && password === "123") onEnter();
            else setError("Use admin e a senha 123 para entrar.");
          }}
        >
          <strong className="block text-[14px] font-extrabold">Login</strong>
          <label className="block text-[12px] font-semibold text-[#4a5568]">
            E-mail
            <input
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-[14px] font-normal"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              placeholder="admin"
              type="text"
            />
          </label>
          <label className="block text-[12px] font-semibold text-[#4a5568]">
            Senha
            <input
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-[#c4c6cf] px-4 text-[14px] font-normal"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="123"
              type="password"
            />
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-[#183a78]"
          >
            Esqueci minha senha
          </button>
          {error && (
            <p role="alert" className="text-xs font-semibold text-[#c53030]">
              {error}
            </p>
          )}
          <button
            className="mt-2 h-14 w-full rounded-[28px] bg-[#183a78] text-base font-extrabold text-white shadow-[0_4px_20px_rgba(26,54,93,.08)]"
            type="submit"
          >
            Entrar
          </button>
        </form>
        <p className="mt-5 text-[14px] text-[#4a5568]">
          Não tem conta?{" "}
          <button onClick={onCreateAccount} className="font-semibold text-[#183a78]">
            Criar conta
          </button>
        </p>
        <div className="my-5 flex items-center gap-4 text-[12px] font-extrabold text-[#4a5568]">
          <i className="h-px flex-1 bg-[#dfe5ec]" />
          OU
          <i className="h-px flex-1 bg-[#dfe5ec]" />
        </div>
        <button
          type="button"
          onClick={() => onProvider("Google")}
          className="mb-3 flex h-14 w-full items-center rounded-[18px] border-[1.5px] border-[#b2f5ea] pl-6 text-[16px] font-semibold shadow-[0_4px_12px_rgba(24,58,120,.08)]"
        >
          <b className="mr-4 text-[#4285f4]">G</b>Continuar com Google
        </button>
        <button
          type="button"
          onClick={() => onProvider("Apple")}
          className="flex h-14 w-full items-center rounded-[18px] border-[1.5px] border-[#b2f5ea] pl-6 text-[16px] font-semibold shadow-[0_4px_12px_rgba(24,58,120,.08)]"
        >
          <b className="mr-4 text-black">●</b>Continuar com Apple
        </button>
      </section>
    </main>
  );
}
