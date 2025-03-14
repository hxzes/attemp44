import type { NextApiResponse } from "next"
import { type AuthRequest, withAdmin } from "../../../lib/auth"
import { supabase } from "../../../lib/supabase"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id, nickname, role, is_banned } = req.body

    if (!id) {
      return res.status(400).json({ error: "User ID is required" })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("user_profiles").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Check if nickname is already taken
    if (nickname && nickname !== user.nickname) {
      const { data: existingUsers, error: checkError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("nickname", nickname)
        .neq("id", id)

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
        nickname: nickname || user.nickname,
        role: role || user.role,
        is_banned: is_banned !== undefined ? is_banned : user.is_banned,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({
      message: "User updated successfully",
      user: data[0],
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAdmin(handler)

