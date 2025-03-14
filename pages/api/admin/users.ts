import type { NextApiResponse } from "next"
import { type AuthRequest, withAdmin } from "../../../lib/auth"
import { supabase } from "../../../lib/supabase"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Get all users from Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      return res.status(500).json({ error: authError.message })
    }

    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabase.from("user_profiles").select("*")

    if (profilesError) {
      return res.status(500).json({ error: profilesError.message })
    }

    // Combine auth users and profiles
    const users = authUsers.users.map((user) => {
      const profile = profiles.find((p) => p.id === user.id) || {}
      return {
        id: user.id,
        email: user.email,
        nickname: profile.nickname || user.email,
        role: profile.role || "user",
        premium_until: profile.premium_until,
        is_banned: profile.is_banned || false,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }
    })

    res.status(200).json(users)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAdmin(handler)

