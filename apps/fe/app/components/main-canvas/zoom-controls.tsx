"use client";
import { Minus, Plus, RotateCcw } from 'lucide-react';

export default function ZoomControls() {
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2">
      <div className="rounded-lg border border-gray-700 flex items-center" style={{ backgroundColor: '#232329' }}>
        <button className="p-2 hover:bg-gray-600 transition-colors text-gray-300">
          <Minus size={16} />
        </button>
        <div className="px-3 py-2 text-sm font-medium border-l border-r border-gray-700 text-gray-300">
          156%
        </div>
        <button className="p-2 hover:bg-gray-600 transition-colors text-gray-300">
          <Plus size={16} />
        </button>
      </div>
      <button className="p-2 hover:bg-gray-600 rounded-lg border border-gray-700 transition-colors text-gray-300" style={{ backgroundColor: '#232329' }} title="Reset zoom">
        <RotateCcw size={16} />
      </button>
      <button className="p-2 hover:bg-gray-600 rounded-lg border border-gray-700 transition-colors text-gray-300" style={{ backgroundColor: '#232329' }} title="Fit to screen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>
    </div>
  );
}