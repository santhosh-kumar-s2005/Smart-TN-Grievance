/**
 * Avatar Component
 * Display user profile pictures with fallback to initials
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User',
  name = 'User',
  size = 'md',
  className,
  online = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(name);
  const bgColor = `hsl(${initials.charCodeAt(0) * 12}, 70%, 60%)`;

  return (
    <motion.div
      className={`relative flex-shrink-0 ${sizeClasses[size]} ${className || ''}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-semibold text-white shadow-sm"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      )}

      {online && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default Avatar;
