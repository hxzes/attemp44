import type { NextApiResponse } from "next"
import { type AuthRequest, withAuth } from "../../../lib/auth"
import { supabase } from "../../../lib/supabase"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(400).json({ error: "Token is required" })
    }

    // Sign out with Supabase Auth
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAuth(handler)

