"use client"

import initDraw from "@/app/draw/canvas";
import { useEffect, useRef } from "react";

export default function Canvas(){
    const canvasRef = useRef <HTMLCanvasElement>(null);

    useEffect(()=>{
        if (canvasRef.current){
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            initDraw(canvasRef.current, roomId)
        }
    },[canvasRef])
    return <div className="bg-white h-screen w-screen">
    <canvas ref={canvasRef} width={2000} height={2000}></canvas>
</div>
}

