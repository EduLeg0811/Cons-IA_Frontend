type BadgeStyle = 'estilo1' | 'estilo2' | 'estilo3' | 'estilo4' | 'estilo5' | 'badge-page';

const STYLE_CLASSES: Record<BadgeStyle, string> = {
  estilo1: 'bg-[#e3ecff] text-black border-[#c8e6c9]',
  estilo2: 'bg-[#fef3db] text-black border-[#f5d9a3]',
  estilo3: 'bg-[#ddffda] text-black border-[#c8e6c9]',
  estilo4: 'bg-[#f0dcff] text-black border-[#d8b8e8]',
  estilo5: 'bg-[#dcffff] text-black border-[#c8e6c9]',
  'badge-page': 'bg-[#e6ffe0] text-[#216205] border-[#c8e6c9]',
};

interface MetadataBadgeProps {
  variant: BadgeStyle;
  children: React.ReactNode;
}

export function MetadataBadge({ variant, children }: MetadataBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium leading-tight ${STYLE_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}
