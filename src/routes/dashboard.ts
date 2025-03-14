import express from "express"
import { supabase, authenticateToken } from "../server"

const router = express.Router()

// Get user dashboard data
router.get("/user-data", authenticateToken, async (req, res) => {
  try {
    // Get user data
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", req.user.id).single()

    if (userError) {
      return res.status(400).json({ error: userError.message })
    }

    // Get recent tips
    const { data: recentTips, error: tipsError } = await supabase
      .from("tips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (tipsError) {
      return res.status(400).json({ error: tipsError.message })
    }

    // Filter tips based on user's premium status
    const now = new Date()
    const isPremium = user.premium_until && new Date(user.premium_until) > now

    const filteredTips = recentTips.filter((tip) => {
      // If tip is not premium, show to all users
      if (!tip.is_premium) return true

      // If tip is premium, only show to premium users or admins
      return isPremium || user.role === "admin"
    })

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

    // Get user's bankroll
    const { data: bankroll, error: bankrollError } = await supabase
      .from("bankroll")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (bankrollError) {
      return res.status(400).json({ error: bankrollError.message })
    }

    const currentBankroll = bankroll.length > 0 ? bankroll[0].balance : 0

    // Get user's betting history for success rate chart
    const { data: bettingHistory, error: historyError } = await supabase
      .from("bets")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: true })

    if (historyError) {
      return res.status(400).json({ error: historyError.message })
    }

    // Calculate success rate over time
    const successRateData = []
    let runningBalance = 0

    bettingHistory.forEach((bet) => {
      runningBalance += bet.result === "win" ? bet.profit : -bet.stake

      successRateData.push({
        date: new Date(bet.created_at).toLocaleDateString(),
        balance: runningBalance,
      })
    })

    // Prepare response
    res.status(200).json({
      user: {
        nickname: user.nickname,
        email: user.email,
        premium_until: user.premium_until,
        is_premium: isPremium,
      },
      recent_tips: filteredTips,
      win_rate: winRate.toFixed(2),
      bankroll_balance: currentBankroll,
      success_rate_data: successRateData,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update bankroll
router.post("/bankroll", authenticateToken, async (req, res) => {
  try {
    const { balance, description } = req.body

    const { data, error } = await supabase
      .from("bankroll")
      .insert([
        {
          user_id: req.user.id,
          balance,
          description,
          created_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add bet to history
router.post("/bet", authenticateToken, async (req, res) => {
  try {
    const { match, selection, odds, stake, result, profit } = req.body

    const { data, error } = await supabase
      .from("bets")
      .insert([
        {
          user_id: req.user.id,
          match,
          selection,
          odds,
          stake,
          result,
          profit,
          created_at: new Date(),
        },
      ])
      .select()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Calculate betting profit
router.post("/calculate", authenticateToken, async (req, res) => {
  try {
    const { stake, odds, type } = req.body

    let profit = 0

    if (type === "decimal") {
      profit = stake * odds - stake
    } else if (type === "american") {
      if (odds > 0) {
        profit = stake * (odds / 100)
      } else {
        profit = stake / (Math.abs(odds) / 100)
      }
    } else if (type === "fractional") {
      const [numerator, denominator] = odds.split("/").map(Number)
      profit = stake * (numerator / denominator)
    }

    res.status(200).json({
      stake,
      odds,
      type,
      profit: profit.toFixed(2),
      total_return: (Number.parseFloat(stake) + profit).toFixed(2),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

