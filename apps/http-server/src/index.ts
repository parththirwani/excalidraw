import express from "express";
import jwt from "jsonwebtoken";

import { CreateRoomSchema, CreateUserSchema, SignSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db";
import bcrypt from "bcryptjs"
import { Request, Response } from "express";
import cors from "cors"

import dotenv from "dotenv";
import { middleware } from "./middleware/auth";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

/**
 * @route POST /signup
 * @desc Register a new user
 * @access Public
 */
app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return;
    }

    const existing = await prismaClient.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});


/**
 * @route POST /signin
 * @desc Authenticate user and return JWT
 * @access Public
 */
app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const parsedData = SignSchema.safeParse(req.body)
    if (!parsedData.success) {
      res.status(400).json({
        message: "Incorrect inputs"
      })
      return;
    }

    const foundUser = await prismaClient.user.findUnique({
      where: { email }
    })
    if (!foundUser) {
      res.status(401).json({
        message: "User not found"
      })
      return
    }

    const isValid = await bcrypt.compare(password, foundUser.password)
    if (!isValid) {
      res.status(401).json({
        message: "Incorrect credentials"
      })
      return
    }

    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      JWT_SECRET,
    );
    res.json({ token });
    return
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
    return
  }
})


/**
 * @route POST /room
 * @desc Create a new chat room
 * @access Protected (requires JWT middleware)
 */
// CREATE ROOM
app.post("/room", middleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = CreateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Incorrect inputs" });
      return
    }

    const newRoom = await prismaClient.room.create({
      data: {
        slug: parsed.data.name,
        //@ts-ignore
        adminId: req.userId!,
      },
    });
    res.status(201).json({
      roomId: newRoom.id,
      slug: newRoom.slug,
    });
    return
  } catch (e: any) {
    console.error(e);

    if (e.code === "P2002") {
      // Prisma unique constraint error
      res.status(409).json({ message: "Room slug already exists" });
      return
    }
    res.status(500).json({ message: "Internal server error" });
    return
  }
});
//GET CHATS OF A SINGLE ROOM USING roomId
app.get("/chats/:roomId", async (req: Request, res: Response): Promise<void> => {
  const roomId = Number(req.params.roomId);

  if (!req.params.roomId || isNaN(roomId)) {
    res.status(400).json({ message: "Invalid roomId" });
    return 
  }

  try {
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });
    res.json({ messages });
    return 
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
    return 
  }
});

//GET roomId using slug
app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug
    }
  });
  res.json({
    room
  })
})

app.listen(3001);