import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Plus, Eye, Clock, Users, Globe, Lock, ArrowRight } from "lucide-react";

// Types
interface Room {
  id: number;
  slug: string;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  admin?: {
    name: string;
  };
  _count?: {
    chats: number;
  };
}

interface MyRoomsProps {
  rooms: Room[];
  filteredRooms: Room[];
  searchQuery: string;
  filters: {
    showPublic: boolean;
    showPrivate: boolean;
  };
  onCreateCanvas?: () => void; // Add this prop
}

export function MyRooms({ rooms, filteredRooms, searchQuery, filters, onCreateCanvas }: MyRoomsProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRandomGradient = () => {
    const gradients = [
      "from-indigo-500/20 to-purple-500/20",
      "from-violet-500/20 to-indigo-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-blue-500/20 to-indigo-500/20",
      "from-purple-500/20 to-violet-500/20"
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const getEmptyStateMessage = () => {
    if (rooms.length === 0) {
      return {
        title: "No personal canvases",
        description: "Create your first canvas to get started"
      };
    }
    
    const hasNoFilteredResults = filteredRooms.length === 0;
    const hasActiveFilters = !filters.showPublic || !filters.showPrivate;
    
    if (hasNoFilteredResults && searchQuery && hasActiveFilters) {
      return {
        title: "No canvases match your search and filters",
        description: "Try adjusting your search term or filter settings"
      };
    } else if (hasNoFilteredResults && searchQuery) {
      return {
        title: "No canvases match your search",
        description: "Try a different search term"
      };
    } else if (hasNoFilteredResults && hasActiveFilters) {
      return {
        title: "No canvases match your filters",
        description: "Try adjusting your filter settings"
      };
    }
    
    return {
      title: "No canvases found",
      description: "Try adjusting your search or filters"
    };
  };

  const emptyState = getEmptyStateMessage();
  const showCreateButton = rooms.length === 0; // Only show create button when no rooms exist at all

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Your Canvases</h2>
        <span className="text-sm" style={{ color: '#a8a5ff' }}>
          {filteredRooms.length} of {rooms.length} canvases
        </span>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <div 
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-200 ${
              showCreateButton 
                ? 'bg-white/10 hover:bg-white/20 cursor-pointer border-2 border-dashed border-white/20 hover:border-white/40' 
                : ''
            }`}
            onClick={showCreateButton ? onCreateCanvas : undefined}
            role={showCreateButton ? "button" : undefined}
            tabIndex={showCreateButton ? 0 : undefined}
            onKeyDown={showCreateButton ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onCreateCanvas?.();
              }
            } : undefined}
          >
            <Plus className="h-8 w-8" style={{ color: '#a8a5ff' }} />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {emptyState.title}
          </h3>
          <p style={{ color: '#a8a5ff' }} className="mb-4">
            {emptyState.description}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className={`h-32 bg-gradient-to-br ${getRandomGradient()} relative`}>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-black/40 border-white/20 text-white text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    {room._count?.chats || 0}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-white/90">
                      {room.slug}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#a8a5ff' }}>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(room.createdAt)}
                      </div>
                      {room.admin && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {room.admin.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-2 text-xs ${room.type === 'PUBLIC'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                  >
                    {room.type === 'PUBLIC' ? (
                      <><Globe className="h-3 w-3 mr-1" />Public</>
                    ) : (
                      <><Lock className="h-3 w-3 mr-1" />Private</>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-emerald-500 font-medium">ACTIVE</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2 h-auto group/btn"
                    onClick={() => {
                      window.location.href = `/canvas/${room.id}`;
                    }}
                  >
                    <span className="text-sm mr-1">Open</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}