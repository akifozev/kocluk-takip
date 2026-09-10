import React, { useState } from 'react';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const GRADIENTS = [
  'from-indigo-600 to-violet-600',
  'from-blue-600 to-cyan-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-pink-600',
  'from-violet-600 to-fuchsia-600'
];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatar,
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Compute initials (e.g. "Zeynep Kaya" -> "ZK")
  const getInitials = (n: string) => {
    if (!n) return 'Ö';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Deterministic color from name
  const getGradient = (n: string) => {
    let hash = 0;
    for (let i = 0; i < (n || '').length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[idx];
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-8 h-8 text-xs font-bold rounded-xl',
    md: 'w-11 h-11 text-sm font-bold rounded-xl',
    lg: 'w-14 h-14 text-base font-bold rounded-2xl',
    xl: 'w-16 h-16 text-lg sm:text-xl font-extrabold rounded-2xl',
    '2xl': 'w-20 h-20 text-2xl font-black rounded-3xl'
  };

  const hasPhoto = Boolean(avatar && avatar.trim().length > 0 && !imgError);

  if (hasPhoto) {
    return (
      <img
        src={avatar}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} object-cover shrink-0 shadow-xs border border-white/20 ${className}`}
      />
    );
  }

  // Initials Fallback
  return (
    <div
      className={`${sizeClasses[size]} bg-linear-to-tr ${getGradient(
        name
      )} text-white flex items-center justify-center font-bold tracking-wider shrink-0 shadow-xs select-none border border-white/20 ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
