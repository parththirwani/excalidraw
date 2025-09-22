import express from "express";
import jwt from "jsonwebtoken";
import { CreateRoomSchema, CreateUserSchema, SignSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db";
import bcrypt from "bcryptjs"
import { Request, Response } from "express";
import cors from "cors"
import dotenv from "dotenv";
import { middleware } from "./middleware/auth";
import { generateUniqueRoomCode } from "./utils/privateCode";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const app = express();

// Global middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


/**
 * @route POST /signup
 * @desc Register a new user with hashed password
 * @access Public
 * @body { name: string, email: string, password: string }
 * @returns { message: string, userId: string }
 */
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Validate input data
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ 
        message: "Invalid input data", 
        errors: data.error.errors 
      });
      return;
    }

    // Check if user already exists
    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    // Create new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Failed to create user account" });
  }
});

/**
 * @route POST /signin
 * @desc Authenticate user credentials and return JWT token
 * @access Public
 * @body { email: string, password: string }
 * @returns { token: string }
 */
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Validate input data
    const parsedData = SignSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid input data",
        errors: parsedData.error.errors
      });
      return;
    }

    // Find user by email
    const foundUser = await prismaClient.user.findUnique({
      where: { email }
    });
    if (!foundUser) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});



/**
 * @route POST /room
 * @desc Create a new room with specified type and slug
 * @access Protected (requires JWT)
 * @body { name: string, type: "PUBLIC" | "PRIVATE" }
 * @returns { roomId: number, slug: string, type: string, code?: string }
 */
app.post("/room", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    //@ts-ignore
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    // Validate input data
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ 
        message: "Invalid input data", 
        errors: parsed.error.errors 
      });
      return;
    }

    // Generate code for private rooms
    let code: string | null = null;
    if (parsed.data.type === "PRIVATE") {
      code = await generateUniqueRoomCode();
    }

    // Create new room
    const newRoom = await prismaClient.room.create({
      data: {
        slug: parsed.data.name,
        //@ts-ignore
        adminId: req.userId,
        type: parsed.data.type,
        code: code
      },
    });

    // Prepare response - only include code for the room creator
    const response: any = {
      roomId: newRoom.id,
      slug: newRoom.slug,
      type: newRoom.type
    };

    // Only return code if room is private (code will only exist for private rooms)
    if (newRoom.code) {
      response.code = newRoom.code;
    }

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Room creation error:", error);

    if (error.code === "P2002") {
      res.status(409).json({ message: "Room name already exists, please choose another" });
      return;
    }
    res.status(500).json({ message: "Failed to create room" });
  }
});
/**
 * @route GET /rooms
 * @desc Retrieve ALL rooms for analytics purposes
 * @access Protected (requires JWT)
 * @returns { rooms: Room[] }
 */
app.get("/rooms", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    //@ts-ignore
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const rooms = await prismaClient.room.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        slug: true,
        type: true,
        createdAt: true,
        admin: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            chats: true
          }
        }
      }
    });

    res.json({ rooms });
  } catch (error) {
    console.error("Fetch all rooms error:", error);
    res.status(500).json({ message: "Failed to retrieve all rooms" });
  }
});

/**
 * @route GET /public-rooms
 * @desc Retrieve all public rooms excluding those created by the authenticated user
 * @access Protected (requires JWT)
 * @returns { rooms: Room[] }
 */
app.get("/public-rooms", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    //@ts-ignore
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const rooms = await prismaClient.room.findMany({
      where: {
        type: "PUBLIC",
        NOT: {
          //@ts-ignore
          adminId: req.userId
        }
      },
      orderBy: { id: "desc" },
      select: {
        id: true,
        slug: true,
        type: true,
        createdAt: true,
        admin: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            chats: true
          }
        }
      }
    });

    res.json({ rooms });
  } catch (error) {
    console.error("Fetch public rooms error:", error);
    res.status(500).json({ message: "Failed to retrieve public rooms" });
  }
});

/**
 * @route GET /my-rooms
 * @desc Retrieve all rooms created by the authenticated user
 * @access Protected (requires JWT)
 * @returns { rooms: Room[] }
 */
app.get("/my-rooms", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if user is authenticated
    //@ts-ignore
    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const rooms = await prismaClient.room.findMany({
      where: {
        //@ts-ignore
        adminId: req.userId
      },
      orderBy: { id: "desc" },
      select: {
        id: true,
        slug: true,
        type: true,
        code: true, // Including code since this is the room creator
        createdAt: true,
        _count: {
          select: {
            chats: true
          }
        }
      }
    });

    res.json({ rooms });
  } catch (error) {
    console.error("Fetch user rooms error:", error);
    res.status(500).json({ message: "Failed to retrieve your rooms" });
  }
});
/**
 * @route GET /room/:slug
 * @desc Retrieve room details by slug identifier
 * @access Public
 * @params { slug: string }
 * @returns { room: Room | null }
 */
app.get("/room/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      res.status(400).json({ message: "Room slug is required" });
      return;
    }

    const room = await prismaClient.room.findFirst({
      where: { slug },
      select: {
        id: true,
        slug: true,
        type: true,
        createdAt: true,
        admin: {
          select: {
            name: true
          }
        }
      }
    });

    if (!room) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    res.json({ room });
  } catch (error) {
    console.error("Fetch room by slug error:", error);
    res.status(500).json({ message: "Failed to retrieve room details" });
  }
});

/**
 * @route GET /shapes/:roomId
 * @desc Retrieve recent chat messages/shapes for a specific room
 * @access Public
 * @params { roomId: number }
 * @returns { messages: Chat[] }
 */
app.get("/shapes/:roomId", async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);

    // Validate room ID parameter
    if (!req.params.roomId || isNaN(roomId) || roomId <= 0) {
      res.status(400).json({ message: "Valid room ID is required" });
      return;
    }

    // Check if room exists
    const roomExists = await prismaClient.room.findUnique({
      where: { id: roomId }
    });

    if (!roomExists) {
      res.status(404).json({ message: "Room not found" });
      return;
    }

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
      select: {
        id: true,
        message: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({ messages });
  } catch (error) {
    console.error("Fetch room shapes error:", error);
    res.status(500).json({ message: "Failed to retrieve room messages" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});