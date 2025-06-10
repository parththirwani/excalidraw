"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  resize = 'vertical',
  className = '',
  ...props
}, ref) => {
  const baseClasses = "w-full bg-gray-800 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm rounded-lg";
  
  const variants = {
    default: "border-gray-600 hover:border-gray-500 focus:border-purple-500",
    filled: "border-transparent bg-gray-700 hover:bg-gray-650 focus:bg-gray-800 focus:border-purple-500"
  };
  
  const resizeClasses = {
    none: "resize-none",
    vertical: "resize-y",
    horizontal: "resize-x",
    both: "resize"
  };
  
  const textareaClasses = `${baseClasses} ${variants[variant]} ${resizeClasses[resize]} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});