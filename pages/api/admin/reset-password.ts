import type { NextApiResponse } from "next"
import { type AuthRequest, withAdmin } from "../../../lib/auth"
import { supabase } from "../../../lib/supabase"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { id, password } = req.body

    if (!id || !password) {
      return res.status(400).json({ error: "User ID and password are required" })
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("user_profiles").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Reset password with Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(id, {
      password,
    })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAdmin(handler)

