import { useState, useEffect } from 'react';

// Updated Types to include code
interface Room {
  id: number;
  slug: string;
  type: 'PUBLIC' | 'PRIVATE';
  code?: string; // Added code field for private rooms
  createdAt: string;
  admin?: {
    name: string;
  };
  _count?: {
    chats: number;
  };
}

interface SingleRoom {
  id: number;
  slug: string;
  type: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  admin: {
    name: string;
  };
  code: string
}

interface SingleRoomApiResponse {
  room: SingleRoom;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse {
  rooms: Room[];
}

interface UserApiResponse {
  user: User;
}

interface ApiError {
  message: string;
  errors?: any[];
}

// Updated CreateRoom response interface
interface CreateRoomResponse {
  roomId: number;
  slug: string;
  type: 'PUBLIC' | 'PRIVATE';
  code?: string; // Include code field
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to decode JWT token (client-side only)
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Helper function for API calls
const apiCall = async (endpoint: string): Promise<ApiResponse> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Hook to get current user info from token
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        setUser(null);
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        setError('Invalid authentication token');
        setUser(null);
        return;
      }

      // Extract user info from JWT payload
      setUser({
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0], // Fallback to email username if name not available
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user info';
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
};

// Updated Hook to fetch user's own rooms (includes codes for private rooms)
export const useMyRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/my-rooms');
      
      // Log private room codes for debugging
      data.rooms.forEach(room => {
        if (room.type === 'PRIVATE' && room.code) {
          console.log(`🔒 Private Room "${room.slug}" - Code: ${room.code}`);
        }
      });
      
      setRooms(data.rooms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch your rooms';
      setError(errorMessage);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    refetch: fetchMyRooms,
  };
};

// Hook to fetch public rooms (excluding user's own rooms)
export const usePublicRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/public-rooms');
      setRooms(data.rooms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch public rooms';
      setError(errorMessage);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    refetch: fetchPublicRooms,
  };
};

// Hook to fetch ALL rooms (for analytics)
export const useAllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/rooms');
      setRooms(data.rooms);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch all rooms';
      setError(errorMessage);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    refetch: fetchAllRooms,
  };
};

// Combined hook for both room types with filtering
export const useRooms = () => {
  const myRooms = useMyRooms();
  const publicRooms = usePublicRooms();

  const loading = myRooms.loading || publicRooms.loading;
  const error = myRooms.error || publicRooms.error;

  const refetchAll = () => {
    myRooms.refetch();
    publicRooms.refetch();
  };

  return {
    myRooms: myRooms.rooms,
    publicRooms: publicRooms.rooms,
    loading,
    error,
    refetch: refetchAll,
  };
};

// Updated Hook to create a new room (handles code response)
export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (roomData: { name: string; type: 'PUBLIC' | 'PRIVATE' }): Promise<CreateRoomResponse> => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_BASE_URL}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: CreateRoomResponse = await response.json();
      
      // Log the room creation result, especially for private rooms
      if (result.type === 'PRIVATE' && result.code) {
        console.log(`✅ Created Private Room "${result.slug}" - Code: ${result.code}`);
      } else {
        console.log(`✅ Created Public Room "${result.slug}"`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create room';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRoom,
    loading,
    error,
  };
};

export const useRoom = (slug: string) => {
  const [room, setRoom] = useState<SingleRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = async () => {
    if (!slug) {
      setError('Room slug is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/room/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: SingleRoomApiResponse = await response.json();
      setRoom(data.room);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch room';
      setError(errorMessage);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [slug]);

  return {
    room,
    loading,
    error,
    refetch: fetchRoom,
  };
};