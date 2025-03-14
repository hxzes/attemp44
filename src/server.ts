import express from "express"
import cors from "cors"
import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { Server } from "socket.io"
import http from "http"
import authRoutes from "./routes/auth"
import tipsRoutes from "./routes/tips"
import paymentRoutes from "./routes/payment"
import notificationsRoutes from "./routes/notifications"
import dashboardRoutes from "./routes/dashboard"
import adminRoutes from "./routes/admin"

// Load environment variables
dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || ""
export const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Express app
const app = express()
const server = http.createServer(app)

// Initialize Socket.io for real-time updates
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Authentication middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ error: "Access denied" })

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.user = verified
    next()
  } catch (error) {
    res.status(403).json({ error: "Invalid token" })
  }
}

// Admin role middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ error: "Admin access required" })
  }
}

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tips", tipsRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/notifications", notificationsRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/admin", adminRoutes)

// WebSocket connection for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Authenticate socket connection
  socket.on("authenticate", async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
      socket.data.user = decoded
      socket.join(`user:${decoded.id}`) // Join user-specific room

      if (decoded.role === "admin") {
        socket.join("admin") // Join admin room
      }

      socket.emit("authenticated", { success: true })
    } catch (error) {
      socket.emit("authenticated", { success: false, error: "Invalid token" })
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// Export io for use in other files
export { io }

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

