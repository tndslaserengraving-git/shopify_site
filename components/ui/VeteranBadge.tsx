import { Shield } from 'lucide-react';

interface Props {
  className?: string;
  size?: 'sm' | 'md';
}

export default function VeteranBadge({ className = '', size = 'md' }: Props) {
  const textSize = size === 'sm' ? 9 : 11;
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body font-bold ${className}`}
      style={{
        fontSize: textSize,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#C9A227',
      }}
    >
      <Shield size={iconSize} style={{ color: '#C9A227' }} aria-hidden="true" />
      Veteran-Owned &amp; Operated
    </span>
  );
}
