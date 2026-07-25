import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display mb-2 text-base tracking-[0.28em] text-gold uppercase">404</p>
      <h1 className="font-display mb-4 text-3xl tracking-[0.1em] text-foreground uppercase">
        Страница не найдена
      </h1>
      <p className="mb-6 max-w-md text-sm text-foreground-muted">
        Возможно, ссылка устарела. Вернитесь на главную или откройте каталог услуг.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary text-sm">
          На главную
        </Link>
        <Link href="/uslugi" className="btn-secondary text-sm">
          Услуги
        </Link>
      </div>
    </div>
  );
}
