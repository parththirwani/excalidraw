import { useEffect, useRef, useState } from "react";
import { Menu, Share, BookOpen } from 'lucide-react';
import { ShapeLogic } from "../draw/ShapeLogic";
import Toolbar from "./main-canvas/toolbar";
import ZoomControls from "./main-canvas/zoom-controls";
import Sidebar from "./main-canvas/sidebar";
import { useRoom } from "@/hooks/get-rooms";
import { ShareModal } from "./main-canvas/share";

type Shape = "circle" | "rect" | "pencil";

// Main Canvas Component
export function Canvas({
  slug,
  roomId,
  socket,
  roomCode // Add roomCode prop to receive from URL params or dashboard
}: {
  slug: string;    // Used for room data fetching
  roomId: string;  // Used for backend operations (shapes, WebSocket)
  socket: WebSocket;
  roomCode?: string; // Optional room code passed from dashboard/URL
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapeLogicRef = useRef<ShapeLogic | null>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Extract room code from URL if not provided as prop
  const [actualRoomCode, setActualRoomCode] = useState<string | undefined>(roomCode);

  useEffect(() => {
    if (!roomCode) {
      // Try to get room code from URL params if not passed as prop
      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get('code');
      if (codeFromUrl) {
        setActualRoomCode(codeFromUrl);
        console.log(`Room code extracted from URL: ${codeFromUrl}`);
      }
    }
  }, [roomCode]);

  // Fetch room details using slug to get room metadata
  const { room, loading: roomLoading, error: roomError } = useRoom(slug);

  // Log room type and code when room data is loaded
  useEffect(() => {
    if (room && !roomLoading) {
      const finalRoomCode = actualRoomCode || room.code;
      console.log(`Canvas entered - Room Type: ${room.type}, ID: ${room.id}, Slug: ${room.slug}${finalRoomCode ? `, Code: ${finalRoomCode}` : ''}`);
    }
  }, [room, roomLoading, actualRoomCode]);

  useEffect(() => {
    // @ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (canvasRef.current) {
      try {
        // Use roomId for ShapeLogic operations (backend communication)
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
    setShareModalOpen(true);
  };

  const handleLibrary = () => {
    // Add your library logic here
    console.log("Library clicked");
  };

  // Determine the final room code to use
  const finalRoomCode = actualRoomCode || room?.code;

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
          disabled={roomLoading} // Disable while room data is loading
          className="px-3 py-2 rounded-lg border border-gray-700 hover:bg-gray-600 transition-colors text-[#1d1d24] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Share Modal - Pass the room code (from URL, prop, or room data) */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        roomId={roomId}
        roomSlug={room?.slug || slug}
        roomType={room?.type}
        roomCode={finalRoomCode} // Use the final determined room code
      />
    </div>
  );
}