"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";
import { useRoom } from "@/hooks/get-rooms";

export default function RoomCanvas({ slug }: { slug: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
  
  // Fetch room data using slug to get the roomId
  const { room, loading: roomLoading, error: roomError } = useRoom(slug);

  useEffect(() => {
    // Only initialize WebSocket when we have room data
    if (!room || roomLoading) {
      return;
    }

    // Get token from localStorage
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("Connected");
      setSocket(ws);
      
      // Use the actual roomId from the fetched room data
      ws.send(JSON.stringify({
        type: "join_room",
        roomId: room.id // Use room.id instead of slug
      }));
    };
    
    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setConnectionStatus(`Disconnected: ${event.code}`);
      setSocket(null);
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Error");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [room, roomLoading]); // Depend on room data instead of slug

  // Show loading state while fetching room data
  if (roomLoading) {
    return <div>Loading room...</div>;
  }

  // Show error if room not found
  if (roomError || !room) {
    return <div>Error: {roomError || "Room not found"}</div>;
  }

  // Show connection status while WebSocket is connecting
  if (!socket) {
    return <div>{connectionStatus}</div>;
  }

  return (
    <div>
      <Canvas slug={slug} roomId={room.id.toString()} socket={socket} />
    </div>
  );
}