import axios from "axios";
import { Shape } from "../types/shapes";
import { HTTP_BACKEND } from "../config";

export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
    const messages = res.data.messages;
    
    if (!Array.isArray(messages)) {
      console.warn("Messages is not an array:", messages);
      return [];
    }
    
    const shapes = messages
      .map((x: { message: string }) => {
        try {
          return JSON.parse(x.message);
        } catch (error) {
          console.error("Failed to parse message:", x.message, error);
          return null;
        }
      })
      .filter(Boolean); // Remove null values
    
    return shapes;
  } catch (error) {
    console.error("Failed to fetch existing shapes:", error);
    return [];
  }
}

// // Additional HTTP utility functions you might need

// export async function saveShape(roomId: string, shape: Shape): Promise<boolean> {
//   try {
//     await axios.post(`${HTTP_BACKEND}/chats/${roomId}/shapes`, {
//       message: JSON.stringify(shape)
//     });
//     return true;
//   } catch (error) {
//     console.error("Failed to save shape:", error);
//     return false;
//   }
// }

// export async function deleteShape(roomId: string, shapeId: string): Promise<boolean> {
//   try {
//     await axios.delete(`${HTTP_BACKEND}/chats/${roomId}/shapes/${shapeId}`);
//     return true;
//   } catch (error) {
//     console.error("Failed to delete shape:", error);
//     return false;
//   }
// }

// export async function clearAllShapes(roomId: string): Promise<boolean> {
//   try {
//     const response = await axios.delete(`${HTTP_BACKEND}/chats/${roomId}`);
//     return response.data.success;
//   } catch (error) {
//     console.error("Failed to clear all shapes:", error);
//     return false;
//   }
// }

// // Send clear all message via WebSocket
// export function sendClearAllMessage(socket: WebSocket, roomId: string): boolean {
//   try {
//     socket.send(JSON.stringify({
//       type: "clear_all",
//       roomId: roomId
//     }));
//     return true;
//   } catch (error) {
//     console.error("Failed to send clear all message:", error);
//     return false;
//   }
// }