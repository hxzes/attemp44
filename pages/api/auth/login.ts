import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ error: error.message })
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      return res.status(500).json({ error: profileError.message })
    }

    // Check if user is banned
    if (profile.is_banned) {
      return res.status(403).json({ error: "Your account has been banned" })
    }

    res.status(200).json({
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        nickname: profile.nickname,
        role: profile.role,
        premium_until: profile.premium_until,
        created_at: profile.created_at,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

