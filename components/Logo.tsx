type LogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showTag?: boolean;
  onDark?: boolean;
  className?: string;
};

export function Logo({ size = 'md', showTag = true, onDark = false, className = '' }: LogoProps) {
  const dims = {
    sm: { barH: 22, bar1: 9, bar2: 14, bar3: 22, barW: 5, gap: 2, text: 14, tag: 11 },
    md: { barH: 28, bar1: 12, bar2: 20, bar3: 28, barW: 7, gap: 2, text: 17, tag: 13 },
    lg: { barH: 46, bar1: 20, bar2: 32, bar3: 46, barW: 12, gap: 3, text: 28, tag: 14 },
  }[size];

  const textColor = onDark ? 'text-white' : 'text-neutral-900';
  const tagColor = onDark ? 'text-white/60' : 'text-neutral-500';
  const dividerColor = onDark ? 'bg-white/20' : 'bg-neutral-300';

  return (
    <div className={`flex items-center gap-[10px] ${className}`} aria-label="Equip2Lead Coaching">
      <div className="flex items-end" style={{ gap: dims.gap, height: dims.barH }} aria-hidden="true">
        <div style={{ width: dims.barW, height: dims.bar1, background: '#F9250E', borderRadius: 2 }} />
        <div style={{ width: dims.barW, height: dims.bar2, background: '#F9250E', borderRadius: 2 }} />
        <div style={{ width: dims.barW, height: dims.bar3, background: '#F9250E', borderRadius: 2 }} />
      </div>
      <div className="flex items-center gap-[9px]">
        <span
          className={`${textColor} font-serif font-bold tracking-tight leading-none`}
          style={{ fontSize: dims.text }}
        >
          equip<span className="text-[#F9250E]">2</span>lead
        </span>
        {showTag && (
          <>
            <span className={dividerColor} style={{ width: 1, height: dims.text * 1.05 }} />
            <span className={`${tagColor} font-medium leading-none`} style={{ fontSize: dims.tag }}>
              Coaching
            </span>
          </>
        )}
      </div>
    </div>
  );
}
