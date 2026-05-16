'use client';

import { RiskLevel } from '@/lib/types';
import { RISK_CONFIG } from '@/lib/colors';
import { useT } from '@/lib/i18n';

interface RiskBadgeProps {
  risk: RiskLevel;
  lang: string;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ risk, lang, size = 'md' }: RiskBadgeProps) {
  const t = useT(lang);
  const cfg = RISK_CONFIG[risk] ?? RISK_CONFIG.normal;
  const labels: Record<RiskLevel, string> = {
    normal:   t.normal,
    mild:     t.mild,
    moderate: t.moderate,
    high:     t.high,
    critical: t.critical,
  };
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border} ${px}`}>
      {labels[risk]}
    </span>
  );
}
