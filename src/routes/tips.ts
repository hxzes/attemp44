import express from "express"
import { supabase, authenticateToken, isAdmin, io } from "../server"

const router = express.Router()

// Get all public betting tips
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data: tips, error } = await supabase.from("tips").select("*").order("created_at", { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Filter tips based on user's premium status
    const now = new Date()
    const isPremium = req.user.premium_until && new Date(req.user.premium_until) > now

    const filteredTips = tips.filter((tip) => {
      // If tip is not premium, show to all users
      if (!tip.is_premium) return true

      // If tip is premium, only show to premium users or admins
      return isPremium || req.user.role === "admin"
    })

    res.status(200).json(filteredTips)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add a new tip (admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { match, league, tip, odds, stake, is_premium, start_time, result } = req.body

    const { data, error } = await supabase
      .from("tips")
      .insert([
        {
          match,
          league,
          tip,
          odds,
          stake,
          is_premium,
          start_time,
          result,
          created_by: req.user.id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Emit real-time update to all connected clients
    io.emit("new-tip", data[0])

    // Create notification for all users
    const { data: users, error: usersError } = await supabase.from("users").select("id")

    if (!usersError && users) {
      const notifications = users.map((user) => ({
        user_id: user.id,
        title: "New Betting Tip",
        message: `New tip added for ${match}`,
        is_read: false,
        created_at: new Date(),
      }))

      await supabase.from("notifications").insert(notifications)

      // Emit notification to all users
      users.forEach((user) => {
        io.to(`user:${user.id}`).emit("new-notification", {
          title: "New Betting Tip",
          message: `New tip added for ${match}`,
        })
      })
    }

    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete a tip (admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase.from("tips").delete().eq("id", id).select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Tip not found" })
    }

    // Emit real-time update to all connected clients
    io.emit("delete-tip", { id })

    res.status(200).json({ message: "Tip deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update tip result (admin only)
router.patch("/:id/result", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { result } = req.body

    const { data, error } = await supabase.from("tips").update({ result, updated_at: new Date() }).eq("id", id).select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Tip not found" })
    }

    // Emit real-time update to all connected clients
    io.emit("update-tip", data[0])

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

