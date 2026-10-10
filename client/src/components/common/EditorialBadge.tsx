import React from 'react';

interface EditorialBadgeProps {
  label: string;
  variant?: 'forest' | 'moss' | 'terracotta' | 'stone' | 'ink';
  className?: string;
}

export const EditorialBadge: React.FC<EditorialBadgeProps> = ({
  label,
  variant = 'forest',
  className = '',
}) => {
  const variantStyles = {
    forest: 'bg-forest/10 text-forest border-forest/20',
    moss: 'bg-moss/10 text-moss border-moss/20',
    terracotta: 'bg-terracotta/10 text-terracotta border-terracotta/20',
    stone: 'bg-stone/30 text-ink-muted border-stone-deep/40',
    ink: 'bg-ink/5 text-ink border-ink/15',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-mono tracking-wider uppercase rounded-[2px] border ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
};
