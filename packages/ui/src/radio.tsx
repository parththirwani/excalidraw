"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  description,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          className={`w-4 h-4 bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 checked:bg-purple-600 checked:border-purple-600 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label className={`text-sm font-medium ${error ? 'text-red-400' : 'text-gray-300'}`}>
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-1">
              {description}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

interface RadioGroupProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: string;
}

export const RadioGroup = ({ children, className = '', label, error }: RadioGroupProps) => {
  return (
    <div className={className}>
      {label && (
        <label className={`block text-sm font-medium mb-3 ${error ? 'text-red-400' : 'text-gray-300'}`}>
          {label}
        </label>
      )}
      <div className="space-y-3">
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};