import { ReactNode, useState } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  activated?: boolean;
  tooltip?: string;
  variant?: "default" | "danger";
}

export function IconButton({ 
  icon, 
  onClick, 
  activated = false, 
  tooltip,
  variant = "default"
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseClasses = "p-3 rounded-lg border-2 transition-all duration-200 relative";
  const variantClasses = {
    default: activated 
      ? "bg-blue-500 border-blue-500 text-white shadow-lg" 
      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    danger: "bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
  };

  return (
    <div className="relative">
      <button
        className={`${baseClasses} ${variantClasses[variant]}`}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {icon}
      </button>
      
      {tooltip && showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-10">
          {tooltip}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
        </div>
      )}
    </div>
  );
}