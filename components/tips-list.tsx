"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface Tip {
  id: number
  match: string
  prediction: string
  odds: number
  isPremium: boolean
  date: string
  sport: string
  status?: "won" | "lost" | "pending"
}

interface TipsListProps {
  limit?: number
  isPremium: boolean
}

export function TipsList({ limit, isPremium }: TipsListProps) {
  const [tips, setTips] = useState<Tip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching tips from database
    const fetchTips = () => {
      setLoading(true)

      // Mock data - in a real app, this would be a fetch from your Supabase database
      setTimeout(() => {
        setTips(mockTips)
        setLoading(false)
      }, 1000)
    }

    fetchTips()
  }, [])

  const displayTips = limit ? tips.slice(0, limit) : tips

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit || 5)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-md bg-purple-900/10 p-4">
            <div className="h-4 w-3/4 rounded bg-purple-900/20"></div>
            <div className="mt-2 h-4 w-1/2 rounded bg-purple-900/20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (tips.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-md bg-purple-900/10 p-4 text-center">
        <p className="text-muted-foreground">No betting tips available at the moment.</p>
        <p className="text-sm text-muted-foreground">Check back soon for new recommendations.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayTips.map((tip) => (
        <div
          key={tip.id}
          className={`group relative overflow-hidden rounded-md border border-purple-900/20 bg-black/40 p-4 transition-all duration-300 hover:shadow-[0_0_15px_rgba(120,58,180,0.2)]`}
        >
          {tip.isPremium && (
            <Badge className="absolute right-2 top-2 bg-[hsl(var(--premium-badge))] text-[hsl(var(--premium-badge-text))]">
              Premium
            </Badge>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">{tip.match}</h3>
              <p
                className={`mt-1 text-sm ${
                  tip.isPremium && !isPremium ? "blur-sm text-transparent" : "text-muted-foreground"
                }`}
              >
                {tip.isPremium && !isPremium ? "Premium content" : tip.prediction}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`text-sm font-medium ${
                  tip.isPremium && !isPremium ? "blur-sm text-transparent" : "text-white"
                }`}
              >
                {tip.isPremium && !isPremium ? "X.XX" : tip.odds.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{tip.date}</div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {tip.sport}
            </Badge>

            {tip.status && (
              <Badge
                className={`${
                  tip.status === "won"
                    ? "bg-green-600/20 text-green-400"
                    : tip.status === "lost"
                      ? "bg-red-600/20 text-red-400"
                      : "bg-yellow-600/20 text-yellow-400"
                }`}
              >
                {tip.status === "won" ? "Won" : tip.status === "lost" ? "Lost" : "Pending"}
              </Badge>
            )}
          </div>

          {tip.isPremium && !isPremium && (
            <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--premium-overlay))] backdrop-blur-md transition-opacity duration-300 dark:bg-black/80">
              <div className="text-center">
                <Lock className="mx-auto mb-2 h-8 w-8 text-[hsl(var(--premium-badge))]" />
                <p className="mb-3 text-[hsl(var(--premium-overlay-text))]">Premium Content</p>
                <Button asChild className="bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]">
                  <Link href="/register">Unlock Premium</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Mock data - in a real app, this would come from your database
const mockTips: Tip[] = [
  {
    id: 1,
    match: "Manchester City vs Liverpool",
    prediction: "Manchester City to win and both teams to score",
    odds: 3.25,
    isPremium: true,
    date: "Today, 20:45",
    sport: "Football",
    status: "pending",
  },
  {
    id: 2,
    match: "Lakers vs Warriors",
    prediction: "Over 220.5 points",
    odds: 1.95,
    isPremium: false,
    date: "Today, 23:00",
    sport: "Basketball",
    status: "pending",
  },
  {
    id: 3,
    match: "Djokovic vs Alcaraz",
    prediction: "Alcaraz to win",
    odds: 2.1,
    isPremium: true,
    date: "Yesterday, 14:30",
    sport: "Tennis",
    status: "won",
  },
  {
    id: 4,
    match: "Arsenal vs Tottenham",
    prediction: "Arsenal to win",
    odds: 1.85,
    isPremium: false,
    date: "Yesterday, 16:00",
    sport: "Football",
    status: "won",
  },
  {
    id: 5,
    match: "PSG vs Bayern Munich",
    prediction: "Both teams to score",
    odds: 1.75,
    isPremium: false,
    date: "2 days ago, 20:45",
    sport: "Football",
    status: "lost",
  },
  {
    id: 6,
    match: "Celtics vs Bucks",
    prediction: "Celtics -4.5",
    odds: 1.9,
    isPremium: true,
    date: "2 days ago, 01:30",
    sport: "Basketball",
    status: "won",
  },
  {
    id: 7,
    match: "Nadal vs Medvedev",
    prediction: "Over 3.5 sets",
    odds: 1.65,
    isPremium: false,
    date: "3 days ago, 12:00",
    sport: "Tennis",
    status: "won",
  },
  {
    id: 8,
    match: "Chiefs vs Eagles",
    prediction: "Chiefs to win",
    odds: 2.05,
    isPremium: true,
    date: "3 days ago, 22:15",
    sport: "American Football",
    status: "won",
  },
]

