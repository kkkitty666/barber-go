interface OrnamentDividerProps {
  className?: string;
  label?: string;
}

export function OrnamentDivider({ className = "", label }: OrnamentDividerProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="text-gold/60 text-[10px]">◆</span>
        {label && (
          <span className="tagline-text">{label}</span>
        )}
        <span className="text-gold/60 text-[10px]">◆</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </div>
  );
}
