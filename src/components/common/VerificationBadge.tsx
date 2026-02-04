import { Shield, ShieldCheck, Car, FileCheck, User, BadgeCheck, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VerificationStatus } from '@/types';

interface VerificationBadgeProps {
  type: keyof VerificationStatus;
  verified: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const verificationConfig: Record<keyof VerificationStatus, { label: string; icon: typeof Shield }> = {
  identity: {
    label: 'Identidade Verificada',
    icon: User,
  },
  background: {
    label: 'Background Verificado',
    icon: BadgeCheck,
  },
  credentials: {
    label: 'Credenciais Verificadas',
    icon: Award,
  },
  cnh: {
    label: 'CNH Validada',
    icon: FileCheck,
  },
  criminalRecord: {
    label: 'Antecedentes OK',
    icon: ShieldCheck,
  },
  vehicleInspection: {
    label: 'Veículo Inspecionado',
    icon: Car,
  },
};

export function VerificationBadge({ type, verified, showLabel = true, size = 'md' }: VerificationBadgeProps) {
  const config = verificationConfig[type];
  const Icon = verified ? config.icon : Shield;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        verified ? 'badge-verified' : 'bg-muted text-muted-foreground',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

interface VerificationBadgesProps {
  verification: VerificationStatus;
  size?: 'sm' | 'md';
}

export function VerificationBadges({ verification, size = 'md' }: VerificationBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(verification).map(([key, verified]) => (
        <VerificationBadge
          key={key}
          type={key as keyof VerificationStatus}
          verified={verified}
          size={size}
        />
      ))}
    </div>
  );
}
