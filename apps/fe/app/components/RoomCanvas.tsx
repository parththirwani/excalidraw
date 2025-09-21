"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";

export default function RoomCanvas({roomId}:{roomId: string}){
    const [socket,setSocket] = useState<WebSocket| null >(null)
    const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...")

    useEffect(()=>{
        // Get token from localStorage (you should implement proper auth)
        const token = localStorage.getItem('token')
        const ws = new WebSocket(`${WS_URL}?token=${token}`)

        ws.onopen = () =>{
            console.log("WebSocket connected");
            setConnectionStatus("Connected");
            setSocket(ws)
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }

        ws.onclose = (event) => {
            console.log("WebSocket closed:", event.code, event.reason);
            setConnectionStatus(`Disconnected: ${event.code}`);
            setSocket(null);
        }

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnectionStatus("Error");
        }

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }
    },[roomId]) 

    if (!socket){
        return <div>
            {connectionStatus}
        </div>
    }

    return <div>
        <div style={{position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', borderRadius: '3px'}}>
            Status: {connectionStatus} | Room: {roomId}
        </div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}