import { Shape } from "../types/shapes";
import { getExistingShapes } from "./http";
import { HTTP_BACKEND } from "../config";

export class ShapeLogic {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private currentPencilPoints: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");
    this.ctx = ctx;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;

    this.init();
  }

  private async init() {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
    } catch (error) {
      console.error("Failed to load existing shapes:", error);
      // Continue with empty shapes array
    }

    this.initSocketHandler();
    this.initCanvasEventHandlers();
    this.setupInitialCanvas();
    this.clearCanvasAndRedraw();
  }

  private initSocketHandler() {
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
          const parsedShape = JSON.parse(message.message);
          this.existingShapes.push(parsedShape);
          this.clearCanvasAndRedraw();
        } else if (message.type === "clear_all") {
          // Handle clear all message from other clients
          this.existingShapes = [];
          this.clearCanvasAndRedraw();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };
  }

  private setupInitialCanvas() {
    this.ctx.fillStyle = "#111111"; // Changed from rgba(0,0,0,1)
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private initCanvasEventHandlers() {
    this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    this.canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e));
  }

  private handleMouseDown(e: MouseEvent) {
    this.clicked = true;
    const rect = this.canvas.getBoundingClientRect();
    this.startX = e.clientX - rect.left;
    this.startY = e.clientY - rect.top;

    // Initialize pencil drawing
    // @ts-ignore
    if (window.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: this.startX, y: this.startY }];
    }
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.clicked) return;
    this.clicked = false;

    const rect = this.canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool = window.selectedTool;
    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      const width = endX - this.startX;
      const height = endY - this.startY;

      // Only create shape if it has meaningful dimensions
      if (Math.abs(width) > 5 && Math.abs(height) > 5) {
        shape = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width,
          height,
        };
      }
    } else if (selectedTool === "circle") {
      const width = endX - this.startX;
      const height = endY - this.startY;

      // Only create shape if it has meaningful dimensions
      if (Math.abs(width) > 5 && Math.abs(height) > 5) {
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        const radius = Math.sqrt(width * width + height * height) / 2;

        shape = {
          type: "circle",
          centerX,
          centerY,
          radius,
        };
      }
    } else if (selectedTool === "pencil") {
      // Add final point and create pencil shape
      this.currentPencilPoints.push({ x: endX, y: endY });

      // Only create shape if there are enough points
      if (this.currentPencilPoints.length > 1) {
        shape = {
          type: "pencil",
          points: [...this.currentPencilPoints],
        };
      }
      this.currentPencilPoints = [];
    }

    // Send shape if valid
    if (shape) {
      this.existingShapes.push(shape);
      this.sendShapeToSocket(shape);
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // @ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === "rect") {
      const width = currentX - this.startX;
      const height = currentY - this.startY;

      // Live preview for rectangle
      this.clearCanvasAndRedraw();
      this.ctx.strokeStyle = "rgba(255,255,255,1)";
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (selectedTool === "circle") {
      const width = currentX - this.startX;
      const height = currentY - this.startY;
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.sqrt(width * width + height * height) / 2;

      // Live preview for circle
      this.clearCanvasAndRedraw();
      this.ctx.strokeStyle = "rgba(255,255,255,1)";
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (selectedTool === "pencil") {
      // Add current point to pencil path
      this.currentPencilPoints.push({ x: currentX, y: currentY });

      // Live preview for pencil - draw the current stroke
      this.clearCanvasAndRedraw();

      // Draw current pencil stroke
      if (this.currentPencilPoints.length > 1) {
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);

        for (let i = 1; i < this.currentPencilPoints.length; i++) {
          this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
        }

        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  private sendShapeToSocket(shape: Shape) {
    try {
      this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId: this.roomId
      }));
    } catch (error) {
      console.error("Failed to send shape:", error);
    }
  }

  private clearCanvasAndRedraw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#111111"; // Changed from rgba(0,0,0,1)
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const shape of this.existingShapes) {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil") {
        this.ctx.strokeStyle = "rgba(255,255,255,1)";
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        if (shape.points.length > 1) {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.points[0].x, shape.points[0].y);

          for (let i = 1; i < shape.points.length; i++) {
            this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }

          this.ctx.stroke();
          this.ctx.closePath();
        }
      }
    }
  }

  // Public method to manually refresh shapes from server
  public async refreshShapes() {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
      this.clearCanvasAndRedraw();
    } catch (error) {
      console.error("Failed to refresh shapes:", error);
    }
  }

  // Public method to get current shapes
  public getShapes(): Shape[] {
    return [...this.existingShapes];
  }

  // Public method to clear all shapes locally
  public clearAllShapes() {
    this.existingShapes = [];
    this.clearCanvasAndRedraw();
  }

  // Public method to clear all shapes and notify server
  public async clearAllShapesAndNotify() {
    try {
      // First, clear from the backend database
      const response = await fetch(`${HTTP_BACKEND}/chats/${this.roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear shapes from server');
      }

      // Clear local shapes
      this.existingShapes = [];
      this.clearCanvasAndRedraw();

      // Send clear all message to other clients via WebSocket
      this.socket.send(JSON.stringify({
        type: "clear_all",
        roomId: this.roomId
      }));

      console.log('Successfully cleared all shapes');
    } catch (error) {
      console.error("Failed to clear all shapes:", error);
      // Even if server request fails, clear locally
      this.existingShapes = [];
      this.clearCanvasAndRedraw();
    }
  }
}