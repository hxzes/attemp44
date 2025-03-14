import express from "express"
import { supabase, authenticateToken } from "../server"

const router = express.Router()

// Get user notifications
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark notification as read
router.post("/mark-read", authenticateToken, async (req, res) => {
  try {
    const { notification_id } = req.body

    // Check if notification belongs to user
    const { data: notification, error: checkError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", notification_id)
      .eq("user_id", req.user.id)
      .single()

    if (checkError || !notification) {
      return res.status(404).json({ error: "Notification not found" })
    }

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date() })
      .eq("id", notification_id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark all notifications as read
router.post("/mark-all-read", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true, updated_at: new Date() })
      .eq("user_id", req.user.id)
      .eq("is_read", false)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ message: "All notifications marked as read", count: data.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

