import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { hoverScale, tapScale, fadeIn } from '../../lib/animations';
import { theme } from '../../lib/theme';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  hoverable?: boolean;
  className?: string;
  variant?: 'default' | 'gradient';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, variant = 'default', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-secondary-200 bg-white shadow-sm overflow-hidden',
          variant === 'gradient' && theme.gradients.primary,
          className
        )}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        whileHover={hoverable ? hoverScale : undefined}
        whileTap={hoverable ? tapScale : undefined}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    variants={fadeIn}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  HTMLMotionProps<'h3'>
>(({ className, ...props }, ref) => (
  <motion.h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-secondary-900', className)}
    variants={fadeIn}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  HTMLMotionProps<'p'>
>(({ className, ...props }, ref) => (
  <motion.p
    ref={ref}
    className={cn('text-sm text-secondary-500', className)}
    variants={fadeIn}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    variants={fadeIn}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<'div'>
>(({ className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={cn('flex items-center p-6 pt-0 border-t border-secondary-200', className)}
    variants={fadeIn}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';