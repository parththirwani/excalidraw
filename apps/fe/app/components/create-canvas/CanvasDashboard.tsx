"use client"
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";

import { Users, Lock, Globe, Clock, Search, Filter, Plus, Zap, Activity, Eye, ArrowRight } from "lucide-react";
import { CreateCanvasModal } from "./CreateCanvasModal";

// Mock data for live canvases
const mockCanvases = [
  {
    id: "1",
    name: "Design System Workshop",
    isPublic: true,
    activeUsers: 12,
    lastActivity: "2m ago",
    thumbnail: "from-indigo-500/20 to-purple-500/20",
    status: "hot",
    viewers: 24
  },
  {
    id: "3",
    name: "Product Wireframes",
    isPublic: true,
    activeUsers: 8,
    lastActivity: "1m ago", 
    thumbnail: "from-violet-500/20 to-indigo-500/20",
    status: "hot",
    viewers: 15
  },
  {
    id: "5",
    name: "UI Mockups Review",
    isPublic: true,
    activeUsers: 15,
    lastActivity: "30s ago",
    thumbnail: "from-purple-500/20 to-pink-500/20",
    status: "trending",
    viewers: 32
  },
];

// Mock data for user's own canvases
const userCanvases = [
  {
    id: "user1",
    name: "My Project Sketches",
    isPublic: false,
    activeUsers: 1,
    lastActivity: "1h ago",
    thumbnail: "from-blue-500/20 to-indigo-500/20",
    status: "active",
    viewers: 3
  },
  {
    id: "user2",
    name: "Brand Identity Work",
    isPublic: true,
    activeUsers: 0,
    lastActivity: "3h ago",
    thumbnail: "from-purple-500/20 to-violet-500/20",
    status: "inactive",
    viewers: 12
  },
  {
    id: "user3",
    name: "Team Retrospective",
    isPublic: false,
    activeUsers: 2,
    lastActivity: "45m ago",
    thumbnail: "from-indigo-500/20 to-purple-500/20",
    status: "active",
    viewers: 5
  },
];

export function CanvasDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCanvases = mockCanvases.filter(canvas =>
    canvas.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUserCanvases = userCanvases.filter(canvas =>
    canvas.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hot": 
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">Hot</Badge>;
      case "trending": 
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">Trending</Badge>;
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#111111' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Canvas
          </Button>
        </div>

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
          <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-white">42</p>
                <p className="text-sm" style={{ color: '#a8a5ff' }}>Active Users</p>
              </div>
              <Users className="h-5 w-5" style={{ color: '#a8a5ff' }} />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-white">12</p>
                <p className="text-sm" style={{ color: '#a8a5ff' }}>Public Canvases</p>
              </div>
              <Globe className="h-5 w-5" style={{ color: '#a8a5ff' }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-white">156</p>
                <p className="text-sm" style={{ color: '#a8a5ff' }}>Total Views</p>
              </div>
              <Eye className="h-5 w-5" style={{ color: '#a8a5ff' }} />
            </div>
          </div>
        </div>

        {/* Your Canvases */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Your Canvases</h2>
            <span className="text-sm" style={{ color: '#a8a5ff' }}>{filteredUserCanvases.length} canvases</span>
          </div>
          
          {filteredUserCanvases.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
              <Plus className="h-8 w-8 mx-auto mb-3" style={{ color: '#a8a5ff' }} />
              <h3 className="text-lg font-medium text-white mb-2">No personal canvases</h3>
              <p style={{ color: '#a8a5ff' }}>Create your first canvas to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserCanvases.map((canvas) => (
                <div 
                  key={canvas.id}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className={`h-32 bg-gradient-to-br ${canvas.thumbnail} relative`}>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/40 border-white/20 text-white text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        {canvas.viewers}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate group-hover:text-white/90">
                          {canvas.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#a8a5ff' }}>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {canvas.lastActivity}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {canvas.activeUsers}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 text-xs ${
                          canvas.isPublic 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {canvas.isPublic ? (
                          <><Globe className="h-3 w-3 mr-1" />Public</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" />Private</>
                        )}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {canvas.activeUsers > 0 ? (
                          <>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-500 font-medium">ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-medium">IDLE</span>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-white hover:bg-white/10 p-2 h-auto group/btn"
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

        {/* Public Canvases */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Public Canvases</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-emerald-500">{filteredCanvases.length} Live</span>
            </div>
          </div>
          
          {filteredCanvases.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Search className="h-12 w-12 mx-auto mb-4" style={{ color: '#a8a5ff' }} />
              <h3 className="text-lg font-medium text-white mb-2">No canvases found</h3>
              <p style={{ color: '#a8a5ff' }}>Try adjusting your search or create a new canvas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanvases.map((canvas) => (
                <div 
                  key={canvas.id}
                  className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className={`h-32 bg-gradient-to-br ${canvas.thumbnail} relative`}>
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(canvas.status)}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/40 border-white/20 text-white text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        {canvas.viewers}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate group-hover:text-white/90">
                          {canvas.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm" style={{ color: '#a8a5ff' }}>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {canvas.lastActivity}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {canvas.activeUsers}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 text-xs ${
                          canvas.isPublic 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {canvas.isPublic ? (
                          <><Globe className="h-3 w-3 mr-1" />Public</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" />Private</>
                        )}
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
      </div>

      <CreateCanvasModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}