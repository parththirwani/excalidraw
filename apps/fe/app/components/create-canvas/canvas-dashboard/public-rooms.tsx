import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Search, Eye, Clock, Users, Globe, ArrowRight } from "lucide-react";

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

interface PublicRoomsProps {
  rooms: Room[];
  filteredRooms: Room[];
  searchQuery: string;
  filters: {
    showPublic: boolean;
    showPrivate: boolean;
  };
}

export function PublicRooms({ rooms, filteredRooms, searchQuery, filters }: PublicRoomsProps) {
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

  const getStatusBadge = (room: Room) => {
    const chatCount = room._count?.chats || 0;
    if (chatCount > 10) {
      return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">Hot</Badge>;
    }
    if (chatCount > 5) {
      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Active</Badge>;
    }
    return null;
  };

  const getEmptyStateMessage = () => {
    if (rooms.length === 0) {
      return {
        title: "No public canvases available",
        description: "Be the first to create a public canvas"
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
        title: "No canvases found",
        description: "Try adjusting your search or create a new canvas"
      };
    } else if (hasNoFilteredResults && hasActiveFilters) {
      return {
        title: "No public canvases match your filters",
        description: "Try adjusting your filter settings"
      };
    }
    
    return {
      title: "No canvases found",
      description: "Try adjusting your search or filters"
    };
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Public Canvases</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-sm text-emerald-500">
            {filteredRooms.length} of {rooms.length} Available
          </span>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
          <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#a8a5ff' }} />
          <h3 className="text-lg font-medium text-white mb-2">
            {emptyState.title}
          </h3>
          <p style={{ color: '#a8a5ff' }}>
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
                <div className="absolute top-3 left-3">
                  {getStatusBadge(room)}
                </div>
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
                    className="ml-2 text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  >
                    <Globe className="h-3 w-3 mr-1" />Public
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-emerald-500 font-medium">LIVE</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2 h-auto group/btn"
                    onClick={() => {
                      window.location.href = `/canvas/${room.id}`;
                    }}
                  >
                    <span className="text-sm mr-1">Join</span>
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