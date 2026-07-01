"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display mb-2 text-sm tracking-[0.3em] text-gold uppercase">Ошибка</p>
      <h1 className="font-display mb-4 text-2xl tracking-[0.12em] text-foreground uppercase">
        Что-то пошло не так
      </h1>
      <p className="mb-6 max-w-md text-sm text-foreground-muted">
        Попробуйте обновить страницу. Если проблема повторяется — позвоните нам или напишите в мессенджер.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary text-xs">
          Повторить
        </button>
        <Link href="/" className="btn-secondary text-xs">
          На главную
        </Link>
      </div>
    </div>
  );
}
