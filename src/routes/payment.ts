import express from "express"
import { supabase, authenticateToken, io } from "../server"

const router = express.Router()

// Start transaction, generate payment intent
router.post("/checkout", authenticateToken, async (req, res) => {
  try {
    const { plan } = req.body // 'monthly', 'quarterly', 'yearly'

    let amount, currency, description, duration

    // Set pricing based on plan
    switch (plan) {
      case "monthly":
        amount = "29.99"
        currency = "USD"
        description = "WisePicks Monthly Premium Subscription"
        duration = 30 // days
        break
      case "quarterly":
        amount = "79.99"
        currency = "USD"
        description = "WisePicks Quarterly Premium Subscription"
        duration = 90 // days
        break
      case "yearly":
        amount = "299.99"
        currency = "USD"
        description = "WisePicks Yearly Premium Subscription"
        duration = 365 // days
        break
      default:
        return res.status(400).json({ error: "Invalid plan selected" })
    }

    // Generate a unique payment ID
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    // Store payment info in database
    const { data: payment, error } = await supabase
      .from("payments")
      .insert([
        {
          user_id: req.user.id,
          charge_id: paymentId,
          amount,
          currency,
          plan,
          duration,
          status: "pending",
          created_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // For now, we'll return a simple payment intent
    // In a real implementation, this would redirect to a payment gateway
    res.status(200).json({
      payment_id: payment[0].id,
      charge_id: paymentId,
      amount,
      currency,
      plan,
      // This would normally be a URL to a payment page
      payment_url: `${process.env.FRONTEND_URL}/payment/manual/${payment[0].id}`,
      expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Check payment status
router.get("/status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data: payment, error } = await supabase.from("payments").select("*").eq("id", id).single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Check if payment belongs to user
    if (payment.user_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    res.status(200).json(payment)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Manual payment confirmation (for admin or testing)
router.post("/confirm/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Get payment details
    const { data: payment, error: paymentError } = await supabase.from("payments").select("*").eq("id", id).single()

    if (paymentError) {
      return res.status(400).json({ error: paymentError.message })
    }

    // Check if payment belongs to user or user is admin
    if (payment.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" })
    }

    // Update payment status
    const { data, error } = await supabase
      .from("payments")
      .update({
        status: "completed",
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    // Update user's premium status
    const premiumUntil = new Date()
    premiumUntil.setDate(premiumUntil.getDate() + payment.duration)

    await supabase
      .from("users")
      .update({
        premium_until: premiumUntil,
        updated_at: new Date(),
      })
      .eq("id", payment.user_id)

    // Create notification for user
    await supabase.from("notifications").insert([
      {
        user_id: payment.user_id,
        title: "Premium Subscription Activated",
        message: `Your premium subscription has been activated until ${premiumUntil.toLocaleDateString()}`,
        is_read: false,
        created_at: new Date(),
      },
    ])

    // Emit real-time update to user
    io.to(`user:${payment.user_id}`).emit("premium-status-updated", {
      premium_until: premiumUntil,
    })

    io.to(`user:${payment.user_id}`).emit("new-notification", {
      title: "Premium Subscription Activated",
      message: `Your premium subscription has been activated until ${premiumUntil.toLocaleDateString()}`,
    })

    res.status(200).json({
      message: "Payment confirmed successfully",
      premium_until: premiumUntil,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

