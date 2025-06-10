import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SignSchema } from "@repo/common/types";
import { prismaCLient } from "@repo/db";

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

/**
 * @route POST /signup
 * @desc Register a new user
 * @access Public
 */
app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({ message: "Incorrect inputs" });
        return;
    }

    try {
        const user = await prismaCLient.user.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        });

        res.json({ userId: user.id });
    } catch (e) {
        res.status(411).json({
            message: "User already exists with this username"
        });
    }
});

/**
 * @route POST /signin
 * @desc Authenticate user and return JWT
 * @access Public
 */
app.post("/signin", async (req, res) => {
    const parsedData = SignSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect Inputs" });
        return;
    }

    // TODO: Use hashed passwords in production
    const user = await prismaCLient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });

    if (!user) {
        res.status(403).json({ message: "Not Authorized" });
        return;
    }

    // Generate JWT with userId
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.json({ token });
});

/**
 * @route POST /room
 * @desc Create a new chat room
 * @access Protected (requires JWT middleware)
 */
app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }

    // @ts-ignore added to bypass TS error from middleware-injected userId
    const userId = req.userId;

    try {
        const room = await prismaCLient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        });

        res.json({ roomId: room.id });
    } catch (e) {
        res.status(411).json({
            message: "Room with this name already exists"
        });
    }
});

/**
 * @route GET /chats/:roomId
 * @desc Get last 50 chat messages from a room
 * @access Public
 */
app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prismaCLient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaCLient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})
// Start the server on port 3001
app.listen(3001, () => {
    console.log("Server listening on port 3001");
});
