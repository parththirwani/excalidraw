import { useEffect, useRef, useState } from "react";
import { ShapeLogic } from "../draw/ShapeLogic";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal, Trash2 } from "lucide-react";

type Shape = "circle" | "rect" | "pencil";

export function Canvas({
    roomId,
    socket
}: {
    roomId: string
    socket: WebSocket
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapeLogicRef = useRef<ShapeLogic | null>(null);
    const [selectedTool, setSelectedTool] = useState<Shape>("circle");

    useEffect(() => {
        //@ts-ignore
        window.selectedTool = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        if (canvasRef.current) {
            try {
                shapeLogicRef.current = new ShapeLogic(canvasRef.current, roomId, socket);
            } catch (error) {
                console.error("Failed to initialize ShapeLogic:", error);
            }
        }
    }, [canvasRef, roomId, socket]);

    const handleClearAll = async () => {
        if (shapeLogicRef.current) {
            await shapeLogicRef.current.clearAllShapesAndNotify();
        }
    };

    return (
        <div style={{
            height: "100vh",
            overflow: "hidden"
        }}>
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
            />
            <TopBar
                setSelectedTool={setSelectedTool}
                selectedTool={selectedTool}
                onClearAll={handleClearAll}
            />
        </div>
    );
}

function TopBar({
    selectedTool,
    setSelectedTool,
    onClearAll
}: {
    selectedTool: Shape,
    setSelectedTool: (s: Shape) => void,
    onClearAll: () => void
}) {
    return (
        <div style={{
            position: "fixed",
            top: 50,
            left: 20
        }}>
            <div className="flex gap-1">
                <IconButton
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                    onClick={() => setSelectedTool("pencil")}
                    tooltip="Pencil Tool"
                />
                <IconButton
                    activated={selectedTool === "rect"}
                    icon={<RectangleHorizontal />}
                    onClick={() => setSelectedTool("rect")}
                    tooltip="Rectangle Tool"
                />
                <IconButton
                    activated={selectedTool === "circle"}
                    icon={<Circle />}
                    onClick={() => setSelectedTool("circle")}
                    tooltip="Circle Tool"
                />
                <IconButton
                    activated={false}
                    icon={<Trash2 />}
                    onClick={onClearAll}
                    tooltip="Clear All Shapes"
                    variant="danger"
                />
            </div>
        </div>
    );
}