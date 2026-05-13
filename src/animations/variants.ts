/**
 * Animation Presets
 * Framer Motion variants for consistent animations
 */

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const cardVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    transition: {
      duration: 0.3,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

export const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  closed: {
    x: '-100%',
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

export const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export const skeletonVariants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 0%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
    },
  },
};

export const countUpVariants = {
  animate: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: custom * 0.1,
    },
  }),
};

// Transition presets
export const fastTransition = {
  duration: 0.15,
  ease: 'easeInOut',
};

export const normalTransition = {
  duration: 0.25,
  ease: 'easeInOut',
};

export const slowTransition = {
  duration: 0.35,
  ease: 'easeInOut',
};
