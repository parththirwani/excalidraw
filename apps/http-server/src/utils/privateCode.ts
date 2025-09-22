import { prismaClient } from "@repo/db";


export async function generateUniqueRoomCode(): Promise<string> {
  let code: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    // Generate 6-character alphanumeric code (uppercase)
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Ensure it's exactly 6 characters (pad with random chars if needed)
    while (code.length < 6) {
      code += Math.random().toString(36).charAt(2).toUpperCase();
    }
    
    try {
      // Check if code already exists
      const existing = await prismaClient.room.findUnique({
        where: { code }
      });
      
      if (!existing) {
        isUnique = true;
        return code;
      }
    } catch (error) {
      console.error("Error checking room code uniqueness:", error);
    }
    
    attempts++;
  }
  
  // Fallback: generate timestamp-based code if all attempts failed
  const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
  return timestamp.padStart(6, 'X');
}