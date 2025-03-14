import type { NextApiResponse } from "next"
import { type AuthRequest, withAuth } from "../../../lib/auth"

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    // User is already attached to the request by the auth middleware
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      nickname: req.user.nickname,
      role: req.user.role,
      premium_until: req.user.premium_until,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export default withAuth(handler)

