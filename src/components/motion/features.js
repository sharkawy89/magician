import { domAnimation } from "framer-motion";

/**
 * Loaded on demand by LazyMotion. Keeps enter/exit/opacity/transform
 * animations (including reduced-motion handling) while leaving layout
 * projection and drag features out of the first-paint bundle.
 */
export default domAnimation;
