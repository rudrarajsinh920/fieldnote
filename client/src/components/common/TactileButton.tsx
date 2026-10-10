import React from 'react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quiet' | 'field' | 'terracotta';
  children: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const base =
    'relative inline-flex items-center justify-center font-sans font-medium text-sm px-5 py-3 min-h-[44px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99] active:translate-y-px disabled:opacity-40 disabled:pointer-events-none rounded-[3px] select-none';

  const variants = {
    primary:
      'bg-forest text-paper hover:bg-forest-deep border border-forest-deep shadow-journal-subtle hover:shadow-sm focus-visible:outline-forest',
    secondary:
      'bg-paper text-ink border border-stone-deep hover:bg-stone-light shadow-journal-subtle focus-visible:outline-moss',
    terracotta:
      'bg-terracotta text-paper hover:bg-terracotta-deep border border-terracotta-deep shadow-journal-subtle focus-visible:outline-terracotta',
    quiet:
      'bg-transparent text-ink-muted hover:text-ink hover:bg-stone/30 focus-visible:outline-forest',
    field:
      'bg-field-surface text-field-text border border-field-border hover:border-field-accent hover:text-field-accent focus-visible:outline-field-accent shadow-none',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
