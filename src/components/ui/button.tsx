import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { hoverScale, tapScale } from '../../lib/animations';
import { theme } from '../../lib/theme';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<HTMLMotionProps<'button'>, keyof ButtonBaseProps> & {
    as?: 'button';
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
    as: typeof Link;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      children,
      disabled,
      as: Component = motion.button,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variantStyles = {
      primary: `${theme.gradients.primary} text-white hover:opacity-90`,
      secondary: `${theme.gradients.secondary} text-white hover:opacity-90`,
      outline: 'border border-secondary-200 bg-white hover:bg-secondary-50 text-secondary-700',
      ghost: 'hover:bg-secondary-50 text-secondary-700',
      danger: `${theme.gradients.danger} text-white hover:opacity-90`,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <Component
        ref={ref as React.Ref<HTMLButtonElement & HTMLAnchorElement>}
        type={Component === motion.button ? 'button' : undefined}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        whileHover={hoverScale}
        whileTap={tapScale}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <motion.div className="h-4 w-4 animate-spin rounded-full border-2" />
        ) : (
          children
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';
