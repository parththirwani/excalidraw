import { useEffect, useState } from "react";
import { WS_URL } from "../config";


export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmY0NzY1NC01ZDEyLTQ1NjUtYjVlYy0yNWQ3NGNkNjgyOWIiLCJpYXQiOjE3NDk1NDY3MjV9.ipY5nK8gUPqKsimyYi0DrCZAFefH5B2V4WGmojK_Tqk`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);

    return {
        socket,
        loading
    }

}