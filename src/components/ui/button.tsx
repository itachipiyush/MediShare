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
};

type ButtonAsButton = ButtonBaseProps & Omit<HTMLMotionProps<'button'>, keyof ButtonBaseProps> & {
  as?: 'button';
};

type ButtonAsLink = ButtonBaseProps & Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof ButtonBaseProps> & {
  as: typeof Link;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, as: Component = motion.button, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            [theme.gradients.primary + ' text-white hover:opacity-90']: variant === 'primary',
            [theme.gradients.secondary + ' text-white hover:opacity-90']: variant === 'secondary',
            'border border-secondary-200 bg-white hover:bg-secondary-50 text-secondary-700': variant === 'outline',
            'hover:bg-secondary-50 text-secondary-700': variant === 'ghost',
            [theme.gradients.danger + ' text-white hover:opacity-90']: variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        whileHover={hoverScale}
        whileTap={tapScale}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <motion.div
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          children
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';