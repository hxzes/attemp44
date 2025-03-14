import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { supabase } from "../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh-secret") as { id: string }

    // Get user from database
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", decoded.id).single()

    if (userError || !user) {
      return res.status(401).json({ error: "Invalid refresh token" })
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

    // Store new token in sessions table
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // 1 hour from now

    await supabase.from("sessions").insert([
      {
        user_id: user.id,
        token,
        created_at: new Date(),
        expires_at: expiresAt,
      },
    ])

    res.status(200).json({
      token,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({ error: "Invalid refresh token" })
  }
}

