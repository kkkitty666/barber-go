import { OrnamentDivider } from "./OrnamentDivider";

interface PageSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageSection({ title, subtitle, children, className = "" }: PageSectionProps) {
  return (
    <section className={`section-padding noise-overlay min-h-[calc(100vh-var(--header-offset))] ${className}`}>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="font-display mb-4 text-3xl tracking-[0.3em] text-gold md:text-4xl">
            {title}
          </h1>
          {subtitle && <OrnamentDivider label={subtitle} />}
          {!subtitle && <OrnamentDivider />}
        </div>
        {children}
      </div>
    </section>
  );
}
