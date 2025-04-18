import { Variants } from 'framer-motion';

declare module '../lib/animations' {
  export const fadeIn: Variants;
  export const slideIn: Variants;
  export const scaleIn: Variants;
  export const staggerContainer: Variants;
  export const hoverScale: { scale: number; transition: { duration: number } };
  export const tapScale: { scale: number; transition: { duration: number } };
} 