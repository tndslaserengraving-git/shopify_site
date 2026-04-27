import { Shield } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export default function VeteranBadge({ className = '', size = 'md' }: Props) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const iconSize = size === 'sm' ? 14 : 16;
  return (
    <span className={`inline-flex items-center gap-1.5 font-body font-semibold text-white/90 ${textSize} ${className}`}>
      <Shield size={iconSize} className="text-patriot-red" aria-hidden="true" />
      Veteran-Owned &amp; Operated
    </span>
  );
}
