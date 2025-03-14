import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  nickname: string
  role: string
  premium_until?: string | null
}

export interface AuthRequest extends NextApiRequest {
  user?: AuthUser
}

export const authenticate = async (req: AuthRequest, res: NextApiResponse, next: () => void) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Access token is required" })
    }

    // Verify the token with Supabase Auth
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" })
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return res.status(401).json({ error: "User profile not found" })
    }

    // Check if user is banned
    if (profile.is_banned) {
      return res.status(403).json({ error: "Your account has been banned" })
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email || "",
      nickname: profile.nickname,
      role: profile.role,
      premium_until: profile.premium_until,
    }

    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export const adminOnly = async (req: AuthRequest, res: NextApiResponse, next: () => void) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

// Helper function to use middleware with Next.js API routes
export const withAuth = (handler: any) => {
  return async (req: AuthRequest, res: NextApiResponse) => {
    await new Promise<void>((resolve) => {
      authenticate(req, res, () => resolve())
    }).catch(() => {
      // Authentication failed, response already sent
      return
    })

    // If we got here, authentication was successful
    if (req.user) {
      return handler(req, res)
    }
  }
}

export const withAdmin = (handler: any) => {
  return async (req: AuthRequest, res: NextApiResponse) => {
    await new Promise<void>((resolve) => {
      authenticate(req, res, () => {
        adminOnly(req, res, () => resolve())
      })
    }).catch(() => {
      // Authentication or authorization failed, response already sent
      return
    })

    // If we got here, authentication and authorization were successful
    if (req.user && req.user.role === "admin") {
      return handler(req, res)
    }
  }
}

