export function NotFoundScreen({ onHome }: { onHome: () => void }) {
  return (
    <main className="not-found-screen">
      <section>
        <strong>404</strong>
        <h1>Página não encontrada</h1>
        <p>O endereço informado não existe ou não está disponível.</p>
        <button type="button" onClick={onHome}>
          Voltar ao início
        </button>
      </section>
    </main>
  );
}
