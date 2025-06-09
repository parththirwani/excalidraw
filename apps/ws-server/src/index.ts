import { WebSocketServer, WebSocket } from 'ws';
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prismaCLient } from '@repo/db';

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// Interface to represent connected users
interface User {
  ws: WebSocket;
  rooms: string[];   // List of rooms the user has joined
  userId: string;    // ID extracted from JWT
}

const users: User[] = [];

/**
 * Validates the JWT and extracts userId
 * @param token JWT token from query param
 * @returns userId if valid, otherwise null
 */
function checkUser(token: string): string | null { 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

// Handle new WebSocket connection
wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  // Reject connection if token is invalid
  if (userId === null) {
    ws.close();
    return;
  }

  // Register user in memory
  users.push({
    userId,
    rooms: [],
    ws
  });

  // Handle incoming messages
  ws.on('message', async function message(data) {
    const parseData = JSON.parse(data as unknown as string);

    /**
     * Client wants to join a room
     */
    if (parseData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parseData.roomId);
    }

    /**
     * Client wants to leave a room
     */
    if (parseData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) return;
      user.rooms = user.rooms.filter(x => x !== parseData.roomId);
    }

    /**
     * Client sends a chat message
     * - Save message to DB
     * - Broadcast to all users in the same room
     */
    if (parseData.type === "chat") {
      const roomId = parseData.roomId;
      const message = parseData.message;

      // Save to DB
      await prismaCLient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      });

      // Broadcast to all users in the room
      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message,
            roomId
          }));
        }
      });
    }
  });
});
