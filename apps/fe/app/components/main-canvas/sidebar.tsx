"use client";

import { X, FileText, Download, Share2, Palette, Search, HelpCircle, RotateCcw, Plus, Github, Twitter, MessageCircle, UserPlus, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: FileText, label: 'Open', shortcut: 'Ctrl+O' },
    { icon: Download, label: 'Save to...', shortcut: '' },
    { icon: Share2, label: 'Export image...', shortcut: 'Ctrl+Shift+E' },
    { icon: Share2, label: 'Live collaboration...', shortcut: '' },
    { icon: Palette, label: 'Command palette', shortcut: 'Ctrl+/' },
    { icon: Search, label: 'Find on canvas', shortcut: 'Ctrl+F' },
    { icon: HelpCircle, label: 'Help', shortcut: '?' },
    { icon: RotateCcw, label: 'Reset the canvas', shortcut: '' },
  ];

  const externalLinks = [
    { icon: Plus, label: 'Excalidraw+' },
    { icon: Github, label: 'GitHub' },
    { icon: Twitter, label: 'Follow us' },
    { icon: MessageCircle, label: 'Discord chat' },
    { icon: UserPlus, label: 'Sign up' },
  ];

  const canvasColors = [
    { color: '#ffffff', name: 'White' },
    { color: '#f8fafc', name: 'Light Gray' },
    { color: '#1f2937', name: 'Dark Gray' },
    { color: '#f0fdf4', name: 'Light Green' },
    { color: '#fef2f2', name: 'Light Red' },
    { color: '#000000', name: 'Black' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - only covers the area outside the sidebar */}
      <div 
        className="fixed inset-0 z-30"
        onClick={onClose}
        style={{ backgroundColor: 'transparent' }}
      />

      {/* Sidebar - positioned like Excalidraw */}
      <div 
        className="fixed left-4 top-16 w-64 max-h-[calc(100vh-8rem)] shadow-2xl z-40 rounded-lg overflow-hidden"
        style={{ 
          backgroundColor: '#232329',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
      >
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
          {/* Menu Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-700 text-left transition-colors group text-gray-300 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className="text-gray-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-gray-500">{item.shortcut}</span>
                  )}
                </button>
              ))}

              <div className="border-t border-gray-600 my-3" />

              {/* External Links */}
              {externalLinks.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 text-left transition-colors text-gray-300 text-sm"
                >
                  <item.icon size={16} className="text-gray-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section - Fixed */}
          <div className="border-t border-gray-600 p-4 space-y-4">
            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Theme</label>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                  <Sun size={14} className="text-gray-400" />
                </button>
                <button className="p-2 rounded-md transition-colors" style={{ backgroundColor: '#6366f1' }}>
                  <Moon size={14} className="text-white" />
                </button>
                <button className="p-2 rounded-md hover:bg-gray-700 transition-colors">
                  <Monitor size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Language</label>
              <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 text-sm">
                <span>English</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Canvas Background */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Canvas background</label>
              <div className="grid grid-cols-6 gap-2">
                {canvasColors.map((colorItem, index) => (
                  <button
                    key={index}
                    className={`w-6 h-6 rounded border-2 transition-colors ${
                      index === 2 ? 'border-blue-500' : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ 
                      backgroundColor: colorItem.color,
                      borderColor: index === 2 ? '#6366f1' : undefined
                    }}
                    title={colorItem.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}