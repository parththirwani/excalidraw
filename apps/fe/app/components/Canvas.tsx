import { useEffect, useRef, useState } from "react";
import { Menu, Share, BookOpen } from 'lucide-react';
import { ShapeLogic } from "../draw/ShapeLogic";
import Toolbar from "./main-canvas/toolbar";
import ZoomControls from "./main-canvas/zoom-controls";
import Sidebar from "./main-canvas/sidebar";

type Shape = "circle" | "rect" | "pencil";

// Main Canvas Component
export function Canvas({
  roomId,
  socket
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeLogicRef = useRef<ShapeLogic | null>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // @ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        shapeLogicRef.current = new ShapeLogic(canvasRef.current, roomId, socket);
      } catch (error) {
        console.error("Failed to initialize ShapeLogic:", error);
      }
    }
  }, [canvasRef, roomId, socket]);

  const handleClearAll = async () => {
    if (shapeLogicRef.current) {
      await shapeLogicRef.current.clearAllShapesAndNotify();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleShare = () => {
    // Add your share logic here
    console.log("Share clicked");
  };

  const handleLibrary = () => {
    // Add your library logic here
    console.log("Library clicked");
  };

  return (
    <div className="relative bg-gray-900 text-white" style={{
      height: "100vh",
      overflow: "hidden"
    }}>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0"
      />

      {/* Menu Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg border border-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
          style={{ backgroundColor: '#232329' }}
          title="Menu"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Share and Library Buttons */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={handleShare}
          className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-600 transition-colors text-[#1d1d24] flex items-center gap-2"
          style={{ backgroundColor: '#a8a5ff' }}
          title="Share"
        >
          <Share size={16} />
          <span className="text-sm">Share</span>
        </button>
        
        <button
          onClick={handleLibrary}
          className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-600 transition-colors text-gray-300 flex items-center gap-2"
          style={{ backgroundColor: '#232329' }}
          title="Library"
        >
          <BookOpen size={16} />
          <span className="text-sm">Library</span>
        </button>
      </div>

      {/* UI Components */}
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onClearAll={handleClearAll}
      />
      <ZoomControls />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
}