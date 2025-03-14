import express from "express"
import bcrypt from "bcrypt"
import { supabase, authenticateToken, isAdmin, io } from "../server"

const router = express.Router()

// Get admin dashboard data
router.get("/dashboard", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) {
      return res.status(400).json({ error: usersError.message })
    }

    // Get premium users count
    const now = new Date()
    const { count: premiumUsers, error: premiumError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gt("premium_until", now.toISOString())

    if (premiumError) {
      return res.status(400).json({ error: premiumError.message })
    }

    // Get active tips count
    const { count: activeTips, error: tipsError } = await supabase
      .from("tips")
      .select("*", { count: "exact", head: true })
      .is("result", null)

    if (tipsError) {
      return res.status(400).json({ error: tipsError.message })
    }

    // Calculate win rate (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentResults, error: resultsError } = await supabase
      .from("tips")
      .select("*")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .not("result", "is", null)

    if (resultsError) {
      return res.status(400).json({ error: resultsError.message })
    }

    const totalTips = recentResults.length
    const winningTips = recentResults.filter((tip) => tip.result === "win").length
    const winRate = totalTips > 0 ? (winningTips / totalTips) * 100 : 0

    // Get recent activity
    const { data: recentActivity, error: activityError } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    if (activityError) {
      return res.status(400).json({ error: activityError.message })
    }

    res.status(200).json({
      total_users: totalUsers,
      premium_users: premiumUsers,
      active_tips: activeTips,
      win_rate: winRate.toFixed(2),
      recent_activity: recentActivity,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get all users
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ban user
router.post("/users/:id/ban", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        is_banned: true,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "ban_user",
        details: `Admin ${req.user.nickname} banned user ${user.nickname}. Reason: ${reason}`,
        created_at: new Date(),
      },
    ])

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Unban user
router.post("/users/:id/unban", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        is_banned: false,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "unban_user",
        details: `Admin ${req.user.nickname} unbanned user ${user.nickname}`,
        created_at: new Date(),
      },
    ])

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user details
router.put("/users/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { nickname, email, role } = req.body

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        nickname,
        email,
        role,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "update_user",
        details: `Admin ${req.user.nickname} updated user ${user.nickname}`,
        created_at: new Date(),
      },
    ])

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Reset user password
router.post("/users/:id/reset-password", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { new_password } = req.body

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(new_password, 10)

    // Update user password in Supabase Auth
    const { error: authError } = await supabase.auth.admin.updateUserById(id, { password: new_password })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    // Update user password in users table
    const { data, error } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "reset_password",
        details: `Admin ${req.user.nickname} reset password for user ${user.nickname}`,
        created_at: new Date(),
      },
    ])

    res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user premium status
router.post("/users/:id/premium", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { duration } = req.body // duration in days

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Calculate new premium expiration date
    const premiumUntil = new Date()
    premiumUntil.setDate(premiumUntil.getDate() + duration)

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        premium_until: premiumUntil,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "update_premium",
        details: `Admin ${req.user.nickname} updated premium status for user ${user.nickname} (${duration} days)`,
        created_at: new Date(),
      },
    ])

    // Create notification for user
    await supabase.from("notifications").insert([
      {
        user_id: id,
        title: "Premium Status Updated",
        message: `Your premium subscription has been updated by an admin. New expiration: ${premiumUntil.toLocaleDateString()}`,
        is_read: false,
        created_at: new Date(),
      },
    ])

    // Emit real-time update to user
    io.to(`user:${id}`).emit("premium-status-updated", {
      premium_until: premiumUntil,
    })

    io.to(`user:${id}`).emit("new-notification", {
      title: "Premium Status Updated",
      message: `Your premium subscription has been updated by an admin. New expiration: ${premiumUntil.toLocaleDateString()}`,
    })

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Remove user premium status
router.post("/users/:id/remove-premium", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params

    // Check if user exists
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", id).single()

    if (userError) {
      return res.status(404).json({ error: "User not found" })
    }

    // Update user
    const { data, error } = await supabase
      .from("users")
      .update({
        premium_until: null,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Log activity
    await supabase.from("activity_log").insert([
      {
        user_id: req.user.id,
        action: "remove_premium",
        details: `Admin ${req.user.nickname} removed premium status for user ${user.nickname}`,
        created_at: new Date(),
      },
    ])

    // Create notification for user
    await supabase.from("notifications").insert([
      {
        user_id: id,
        title: "Premium Status Removed",
        message: "Your premium subscription has been removed by an admin.",
        is_read: false,
        created_at: new Date(),
      },
    ])

    // Emit real-time update to user
    io.to(`user:${id}`).emit("premium-status-updated", {
      premium_until: null,
    })

    io.to(`user:${id}`).emit("new-notification", {
      title: "Premium Status Removed",
      message: "Your premium subscription has been removed by an admin.",
    })

    res.status(200).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

