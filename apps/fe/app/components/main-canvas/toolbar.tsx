"use client";
import { Lock, Hand, MousePointer, Square, Diamond, Circle, ArrowUpRight, Minus, Pen, Type, Image, Eraser, Trash2 } from 'lucide-react';

type Shape = "circle" | "rect" | "pencil";

interface ToolbarProps {
  selectedTool?: Shape;
  setSelectedTool?: (tool: Shape) => void;
  onClearAll?: () => void;
}

export default function Toolbar({ selectedTool, setSelectedTool, onClearAll }: ToolbarProps) {
  const tools = [
    { icon: Lock, label: 'Lock', active: false },
    { icon: Hand, label: 'Hand', active: false },
    { icon: MousePointer, label: 'Selection', active: !selectedTool },
    { 
      icon: Square, 
      label: 'Rectangle', 
      active: selectedTool === 'rect',
      onClick: () => setSelectedTool?.('rect')
    },
    { icon: Diamond, label: 'Diamond', active: false },
    { 
      icon: Circle, 
      label: 'Circle', 
      active: selectedTool === 'circle',
      onClick: () => setSelectedTool?.('circle')
    },
    { icon: ArrowUpRight, label: 'Arrow', active: false },
    { icon: Minus, label: 'Line', active: false },
    { 
      icon: Pen, 
      label: 'Draw/Pencil', 
      active: selectedTool === 'pencil',
      onClick: () => setSelectedTool?.('pencil')
    },
    { icon: Type, label: 'Text', active: false },
    { icon: Image, label: 'Image', active: false },
    { icon: Eraser, label: 'Eraser', active: false },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="rounded-lg border border-gray-700 shadow-lg p-2 flex items-center gap-1" style={{ backgroundColor: '#232329' }}>
        {tools.map((tool, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg transition-colors relative group ${
              tool.active
                ? 'text-white'
                : 'hover:bg-gray-600 text-gray-300 hover:text-white'
            }`}
            style={tool.active ? { backgroundColor: '#403e6a' } : {}}
            title={tool.label}
            onClick={tool.onClick}
          >
            <tool.icon size={18} />
          </button>
        ))}
        
        {/* Clear All Button */}
        {onClearAll && (
          <>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            <button
              className="p-2 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
              onClick={onClearAll}
              title="Clear All Shapes"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
      
      {/* Instruction Text */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
        </p>
      </div>
    </div>
  );
}