import { ReactNode } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
  children?: ReactNode;
}

export const Avatar = ({ 
  src, 
  alt, 
  fallback,
  size = 'md',
  shape = 'circle',
  className = '',
  children
}: AvatarProps) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  };
  
  const shapes = {
    circle: "rounded-full",
    square: "rounded-lg"
  };
  
  const baseClasses = `inline-flex items-center justify-center bg-gray-700 text-white font-medium overflow-hidden ${sizes[size]} ${shapes[shape]} ${className}`;
  
  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={baseClasses}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    );
  }
  
  if (children) {
    return (
      <div className={baseClasses}>
        {children}
      </div>
    );
  }
  
  return (
    <div className={baseClasses}>
      {fallback || '?'}
    </div>
  );
};