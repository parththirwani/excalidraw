"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";
import { Canvas } from "./Canvas";


export default function RoomCanvas({roomId}:{roomId: string}){

    const [socket,setSocket] = useState<WebSocket| null >(null)

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGM1NzY3Yy1kZjA5LTRkOTEtODNmMi1mZjRmYzg0MDNlMjUiLCJpYXQiOjE3NDk1NDYzNDV9.v3HcVlL6jrRFUEyN2EAEzcGNpV85vT9eTuAZjW5PM-Y"}`)

        ws.onopen = () =>{
            setSocket(ws)
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }))
        }

    },[])


    if (!socket){
        return <div>
            Connecting to server ...
        </div>
    }


    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}

