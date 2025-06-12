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
    console.log('Invalid token, closing connection');
    ws.close();
    return;
  }

  console.log(`User ${userId} connected`);

  // Register user in memory
  users.push({
    userId,
    rooms: [],
    ws
  });

  // Handle incoming messages
  ws.on('message', async function message(data) {
    try {
      const parseData = JSON.parse(data as unknown as string);
      console.log('Received message:', parseData);

      /**
       * Client wants to join a room
       */
      if (parseData.type === "join_room") {
        const user = users.find(x => x.ws === ws);
        if (user) {
          user.rooms.push(parseData.roomId);
          console.log(`User ${userId} joined room ${parseData.roomId}`);
        }
      }

      /**
       * Client wants to leave a room
       */
      if (parseData.type === "leave_room") {
        const user = users.find(x => x.ws === ws);
        if (!user) return;
        user.rooms = user.rooms.filter(x => x !== parseData.roomId);
        console.log(`User ${userId} left room ${parseData.roomId}`);
      }

      /**
       * Client sends a chat message
       * - Save message to DB
       * - Broadcast to all users in the same room
       */
      if (parseData.type === "chat") {
        const roomIdString = parseData.roomId;
        const message = parseData.message;

        // Convert roomId to integer for database
        const roomId = parseInt(roomIdString, 10);
        
        if (isNaN(roomId)) {
          console.error('Invalid roomId provided:', roomIdString);
          return;
        }

        console.log(`Saving message to room ${roomId} from user ${userId}`);

        // Save to DB
        try {
          await prismaCLient.chat.create({
            data: {
              roomId, // Now this is an integer
              message,
              userId
            }
          });
          console.log('Message saved to database');
        } catch (dbError) {
          console.error('Database error:', dbError);
          return;
        }

        // Broadcast to all users in the room
        const usersInRoom = users.filter(user => user.rooms.includes(roomIdString));
        console.log(`Broadcasting to ${usersInRoom.length} users in room ${roomId}`);
        
        usersInRoom.forEach(user => {
          if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message,
              roomId: roomIdString // Send back as string for consistency
            }));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log(`User ${userId} disconnected`);
    const index = users.findIndex(x => x.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server running on port 8080');