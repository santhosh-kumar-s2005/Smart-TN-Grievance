/**
 * Theme Configuration
 * Government-Tech Inspired Blue Theme
 */

export const theme = {
  colors: {
    // Primary Blues
    primary: {
      50: '#F0F7FF',
      100: '#E0EFFF',
      200: '#BAD9FF',
      300: '#7EC3FF',
      400: '#36A3FF',
      500: '#0077D9',
      600: '#0056A8',
      700: '#004080',
      800: '#002B5C',
      900: '#001A38',
    },

    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#3B82F6',
      pending: '#F59E0B',
      'in-progress': '#3B82F6',
      resolved: '#10B981',
    },

    // Priority Colors
    priority: {
      CRITICAL: '#EF4444',
      HIGH: '#F59E0B',
      MEDIUM: '#FBBF24',
      LOW: '#10B981',
    },

    // Neutrals
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  gradients: {
    primary: 'linear-gradient(135deg, #0077D9 0%, #0056A8 100%)',
    accent: 'linear-gradient(135deg, #0077D9 0%, #3B82F6 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },

  borderRadius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 1, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export type Theme = typeof theme;
