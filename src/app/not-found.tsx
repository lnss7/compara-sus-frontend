import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <h1 className="font-display-lg text-display-lg text-on-surface">404</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Página não encontrada no sistema COMPARA-SUS.
      </p>
      <Link
        href="/"
        className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md"
      >
        Voltar para a Importação
      </Link>
    </div>
  );
}
