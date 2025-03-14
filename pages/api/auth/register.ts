import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "../../../lib/supabase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { nickname, email, password } = req.body

    // Validate input
    if (!nickname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Check if nickname already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("nickname", nickname)

    if (checkError) {
      return res.status(500).json({ error: checkError.message })
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: "Nickname already in use" })
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
        },
      },
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Update the nickname in the user_profiles table
    // (The trigger will create the profile, but we need to update the nickname)
    if (data.user) {
      const { error: updateError } = await supabase.from("user_profiles").update({ nickname }).eq("id", data.user.id)

      if (updateError) {
        return res.status(500).json({ error: updateError.message })
      }
    }

    res.status(201).json({
      message: "User registered successfully",
      user: data.user,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Server error" })
  }
}

