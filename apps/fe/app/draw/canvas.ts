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

export default async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShapes: Shape[] = [];
  
  try {
    existingShapes = await getExistingShapes(roomId);
  } catch (error) {
    console.error("Failed to load existing shapes:", error);
    // Continue with empty shapes array
  }

  // Set up WebSocket message handler
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      // Fixed: Use === instead of = for comparison
      if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        // Fixed: Add the shape itself, not wrapped in another object
        existingShapes.push(parsedShape);
        clearCanvasAndRedraw(existingShapes, ctx, canvas);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  // Add error handling for WebSocket
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = (event) => {
    console.log("WebSocket closed:", event.code, event.reason);
  };

  // Initial canvas setup
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw existing shapes
  clearCanvasAndRedraw(existingShapes, ctx, canvas);

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

    // Only create shape if it has meaningful dimensions
    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };

      existingShapes.push(shape);
      
      // Fixed: Send just the shape, not wrapped in another object
      try {
        socket.send(JSON.stringify({
          type: "chat",
          message: JSON.stringify(shape),
        roomId: roomId  
        }));
      } catch (error) {
        console.error("Failed to send shape:", error);
      }
    }
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
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.strokeRect(startX, startY, width, height);
  });
}

function clearCanvasAndRedraw(shapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (const shape of shapes) {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;
    
    if (!Array.isArray(messages)) {
      console.warn("Messages is not an array:", messages);
      return [];
    }
    
    const shapes = messages.map((x: { message: string }) => {
      try {
        return JSON.parse(x.message);
      } catch (error) {
        console.error("Failed to parse message:", x.message, error);
        return null;
      }
    }).filter(Boolean); // Remove null values
    
    return shapes;
  } catch (error) {
    console.error("Failed to fetch existing shapes:", error);
    return [];
  }
}