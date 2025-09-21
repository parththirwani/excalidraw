import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  Search, 
  Filter,
  Globe,
  Lock,
  X,
  LogOut
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface DashboardHeaderProps {
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefetch: () => void;
  onCreateCanvas: () => void;
  publicRoomsCount: number;
  myRoomsCount: number;
  filters: {
    showPublic: boolean;
    showPrivate: boolean;
  };
  setFilters: (filters: { showPublic: boolean; showPrivate: boolean; }) => void;
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export function DashboardHeader({
  error,
  searchQuery,
  setSearchQuery,
  onRefetch,
  onCreateCanvas,
  publicRoomsCount,
  myRoomsCount,
  filters,
  setFilters,
  user,
  onLogout
}: DashboardHeaderProps) {
  const hasActiveFilters = !filters.showPublic || !filters.showPrivate;

  const clearFilters = () => {
    setFilters({ showPublic: true, showPrivate: true });
  };

  const handleLogout = () => {
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior - redirect to login
      window.location.href = '/';
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2 tracking-tight">
            Canvas Dashboard
          </h1>
          <p className="text-lg" style={{ color: '#a8a5ff' }}>
            Collaborate in real-time with your team
          </p>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <Button
              onClick={onRefetch}
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
          <Button
            onClick={onCreateCanvas}
            className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Canvas
          </Button>
          
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={user?.avatar} 
                    alt={user?.name || user?.email || 'User'} 
                  />
                  <AvatarFallback className="bg-white/10 text-white border border-white/20">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-[#232329] border-white/10 text-white"
              align="start"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  {user?.name && (
                    <p className="text-sm font-medium leading-none text-white">
                      {user.name}
                    </p>
                  )}
                  {user?.email && (
                    <p className="text-xs leading-none text-gray-400">
                      {user.email}
                    </p>
                  )}
                  {!user?.name && !user?.email && (
                    <p className="text-sm font-medium leading-none text-white">
                      User
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">Failed to load canvases</p>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#a8a5ff' }} />
          <Input
            placeholder="Search canvases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-white/10 rounded-lg"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-transparent relative"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-[#232329] border-white/10 text-white"
            align="start"
          >
            <DropdownMenuLabel className="text-gray-400">Canvas Type</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuCheckboxItem
              checked={filters.showPublic}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, showPublic: checked })
              }
              className="text-white focus:bg-white/10 focus:text-white"
            >
              <Globe className="h-4 w-4 mr-2 text-emerald-400" />
              Public Canvases
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.showPrivate}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, showPrivate: checked })
              }
              className="text-white focus:bg-white/10 focus:text-white"
            >
              <Lock className="h-4 w-4 mr-2 text-amber-400" />
              Private Canvases
            </DropdownMenuCheckboxItem>
            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator className="bg-white/10" />
                <button
                  onClick={clearFilters}
                  className="flex items-center w-full px-2 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {!filters.showPublic && (
            <Badge 
              variant="outline" 
              className="text-xs bg-red-500/10 text-red-400 border-red-500/20"
            >
              Public Hidden
            </Badge>
          )}
          {!filters.showPrivate && (
            <Badge 
              variant="outline" 
              className="text-xs bg-red-500/10 text-red-400 border-red-500/20"
            >
              Private Hidden
            </Badge>
          )}
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-white p-1 h-auto"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">{publicRoomsCount}</p>
              <p className="text-sm" style={{ color: '#a8a5ff' }}>Public Canvases</p>
            </div>
            <Globe className="h-5 w-5" style={{ color: '#a8a5ff' }} />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">{myRoomsCount}</p>
              <p className="text-sm" style={{ color: '#a8a5ff' }}>Your Canvases</p>
            </div>
            <Lock className="h-5 w-5" style={{ color: '#a8a5ff' }} />
          </div>
        </div>
      </div>
    </div>
  );
}