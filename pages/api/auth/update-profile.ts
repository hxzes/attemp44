import type { NextApiResponse } from "next"
import { type AuthRequest, withAuth } from "../../../lib/auth"
import { supabase } from "../../../lib/supabase"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { nickname } = req.body

    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    // Check if nickname is already taken
    if (nickname && nickname !== req.user.nickname) {
      const { data: existingUsers, error: checkError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("nickname", nickname)
        .neq("id", req.user.id)

      if (checkError) {
        return res.status(500).json({ error: checkError.message })
      }

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ error: "Nickname already in use" })
      }
    }

    // Update user profile
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        nickname: nickname || req.user.nickname,
        updated_at: new Date(),
      })
      .eq("id", req.user.id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: req.user.id,
        email: req.user.email,
        nickname: data[0].nickname,
        role: data[0].role,
        premium_until: data[0].premium_until,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAuth(handler)

