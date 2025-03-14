import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { supabase } from "../server"
import { authenticateToken } from "../server"

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { nickname, email, password } = req.body

    // Check if email or nickname already exists
    const { data: existingUsers } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},nickname.eq.${nickname}`)

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: "Email or nickname already in use" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    // Create user in users table
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          id: authUser.user.id,
          email,
          nickname,
          password: hashedPassword,
          role: "user",
          premium_until: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    // Get user data from users table
    const { data: user, error } = await supabase.from("users").select("*").eq("id", authData.user.id).single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({ error: "Your account has been banned" })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        premium_until: user.premium_until,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    )

    // Create refresh token
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
      expiresIn: "7d",
    })

    res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        premium_until: user.premium_until,
        created_at: user.created_at,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      premium_until: user.premium_until,
      created_at: user.created_at,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Logout user
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Sign out from Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh-secret")

    // Get user data
    const { data: user, error } = await supabase.from("users").select("*").eq("id", decoded.id).single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({ error: "Your account has been banned" })
    }

    // Create new JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        premium_until: user.premium_until,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" },
    )

    // Create new refresh token
    const newRefreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
      expiresIn: "7d",
    })

    res.status(200).json({
      token,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" })
  }
})

export default router

