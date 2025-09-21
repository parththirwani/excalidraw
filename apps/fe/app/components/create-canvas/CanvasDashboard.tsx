"use client"
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { CreateCanvasModal } from "./CreateCanvasModal";
import { useRooms, useCurrentUser } from "@/hooks/get-rooms"; // Import useCurrentUser
import { DashboardHeader } from "./canvas-dashboard/header";
import { MyRooms } from "./canvas-dashboard/my-rooms";
import { PublicRooms } from "./canvas-dashboard/public-rooms";

interface FilterState {
  showPublic: boolean;
  showPrivate: boolean;
}

export function CanvasDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    showPublic: true,
    showPrivate: true,
  });

  // Get user information from JWT token
  const { user, loading: userLoading, error: userError, isAuthenticated } = useCurrentUser();
  const { myRooms, publicRooms, loading, error, refetch } = useRooms();

  // Apply search and filter logic
  const filteredMyRooms = useMemo(() => {
    return myRooms.filter(room => {
      // Apply search filter
      const matchesSearch = room.slug.toLowerCase().includes(searchQuery.toLowerCase());
      // Apply type filter
      const matchesTypeFilter =
        (room.type === 'PUBLIC' && filters.showPublic) ||
        (room.type === 'PRIVATE' && filters.showPrivate);
      return matchesSearch && matchesTypeFilter;
    });
  }, [myRooms, searchQuery, filters]);

  const filteredPublicRooms = useMemo(() => {
    return publicRooms.filter(room => {
      // Apply search filter
      const matchesSearch = room.slug.toLowerCase().includes(searchQuery.toLowerCase());
      // Apply type filter - public rooms are always PUBLIC, but we check the filter anyway
      const matchesTypeFilter = filters.showPublic;
      return matchesSearch && matchesTypeFilter;
    });
  }, [publicRooms, searchQuery, filters]);

  const handleCreateCanvas = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleRoomCreated = () => {
    refetch(); // Refresh the rooms list when a new room is created
  };

  const handleLogout = () => {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    // Redirect to login page
    window.location.href = '/login';
  };

  // Show loading state while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#a8a5ff' }} />
              <p className="text-lg" style={{ color: '#a8a5ff' }}>Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  // Show loading state for rooms
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#a8a5ff' }} />
              <p className="text-lg" style={{ color: '#a8a5ff' }}>Loading your canvases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardHeader
          error={error}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefetch={refetch}
          onCreateCanvas={handleCreateCanvas}
          publicRoomsCount={publicRooms.length}
          myRoomsCount={myRooms.length}
          filters={filters}
          setFilters={setFilters}
          user={{
            name: user?.name,
            email: user?.email,
          }}
          onLogout={handleLogout}
        />
        
        <MyRooms
          rooms={myRooms}
          filteredRooms={filteredMyRooms}
          searchQuery={searchQuery}
          filters={filters}
          onCreateCanvas={handleCreateCanvas} // Pass the handler here
        />
        
        <PublicRooms
          rooms={publicRooms}
          filteredRooms={filteredPublicRooms}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>
      
      <CreateCanvasModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}