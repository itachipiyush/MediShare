import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ variant = 'default', className, children }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-blue-100 text-blue-800',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'warning' && 'bg-amber-100 text-amber-800',
        variant === 'danger' && 'bg-red-100 text-red-800',
        variant === 'outline' && 'bg-transparent border border-slate-300 text-slate-800',
        className
      )}
    >
      {children}
    </span>
  );
};