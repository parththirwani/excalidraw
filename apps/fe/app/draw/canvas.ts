import axios from "axios";
import { HTTP_BACKEND } from "../config";
type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
};

export  default async function initDraw(canvas: HTMLCanvasElement, roomId: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let existingShapes: Shape[] = await getExistingShapes(roomId)

    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!clicked) return;
        clicked = false;
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - startX;
        const height = endY - startY;

        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width,
            height,
        });

        clearCanvasAndRedraw(existingShapes, ctx, canvas);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!clicked) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = currentX - startX;
        const height = currentY - startY;

        // Live preview
        clearCanvasAndRedraw(existingShapes, ctx, canvas);

        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.strokeRect(startX, startY, width, height);
    });

    function clearCanvasAndRedraw(shapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const shape of shapes) {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.beginPath();
                ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
}

async function getExistingShapes(roomId: string){
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string})=>{
        const messageData = JSON.parse(x.message)
        return messageData;
    })
    return shapes;
}