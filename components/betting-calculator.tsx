"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock } from "lucide-react"

interface BettingCalculatorProps {
  isPremium: boolean
}

export function BettingCalculator({ isPremium }: BettingCalculatorProps) {
  // Profit Calculator
  const [stake, setStake] = useState<number>(100)
  const [odds, setOdds] = useState<number>(2.0)
  const [oddsFormat, setOddsFormat] = useState<string>("decimal")

  // Conversion Calculator
  const [decimalOdds, setDecimalOdds] = useState<number>(2.0)
  const [fractionalOdds, setFractionalOdds] = useState<string>("1/1")
  const [americanOdds, setAmericanOdds] = useState<number>(100)

  // Calculate potential profit
  const calculateProfit = () => {
    let decimalValue = odds

    if (oddsFormat === "american") {
      decimalValue = odds > 0 ? 1 + odds / 100 : 1 + 100 / Math.abs(odds)
    } else if (oddsFormat === "fractional") {
      const [numerator, denominator] = odds.toString().split("/").map(Number)
      decimalValue = numerator / denominator + 1
    }

    return stake * decimalValue - stake
  }

  // Convert between odds formats
  const convertOdds = (value: number, from: string, to: string) => {
    if (from === to) return value

    // First convert to decimal
    let decimal = value
    if (from === "american") {
      decimal = value > 0 ? 1 + value / 100 : 1 + 100 / Math.abs(value)
    } else if (from === "fractional") {
      const [numerator, denominator] = value.toString().split("/").map(Number)
      decimal = numerator / denominator + 1
    }

    // Then convert decimal to target format
    if (to === "decimal") {
      return decimal
    } else if (to === "american") {
      return decimal >= 2 ? (decimal - 1) * 100 : -100 / (decimal - 1)
    } else if (to === "fractional") {
      const decimal1 = decimal - 1
      // This is a simplified conversion - a real app would use GCD for proper fractions
      return `${decimal1.toFixed(2)}/1`
    }

    return value
  }

  // Handle conversion between odds formats
  const handleOddsConversion = (value: string, format: string) => {
    const numValue = Number.parseFloat(value)

    if (format === "decimal") {
      setDecimalOdds(numValue)
      setAmericanOdds(Math.round(convertOdds(numValue, "decimal", "american") as number))
      setFractionalOdds(convertOdds(numValue, "decimal", "fractional") as string)
    } else if (format === "american") {
      setAmericanOdds(numValue)
      setDecimalOdds(Number.parseFloat(convertOdds(numValue, "american", "decimal").toFixed(2)))
      setFractionalOdds(convertOdds(numValue, "american", "fractional") as string)
    }
  }

  const profit = calculateProfit()

  return (
    <Tabs defaultValue="profit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profit" className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white">
          Profit Calculator
        </TabsTrigger>
        <TabsTrigger
          value="conversion"
          className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
          disabled={!isPremium}
        >
          {!isPremium && <Lock className="mr-2 h-3 w-3" />}
          Odds Conversion
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profit" className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="stake">Stake Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="stake"
                type="number"
                value={stake}
                onChange={(e) => setStake(Number.parseFloat(e.target.value) || 0)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds-format">Odds Format</Label>
            <Select value={oddsFormat} onValueChange={setOddsFormat}>
              <SelectTrigger id="odds-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal (2.00)</SelectItem>
                <SelectItem value="american">American (+100)</SelectItem>
                <SelectItem value="fractional" disabled={!isPremium}>
                  {!isPremium && <Lock className="mr-2 h-3 w-3 inline" />}
                  Fractional (1/1)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="odds">Odds</Label>
            <Input
              id="odds"
              type={oddsFormat === "fractional" ? "text" : "number"}
              value={odds}
              onChange={(e) =>
                setOdds(oddsFormat === "fractional" ? (e.target.value as any) : Number.parseFloat(e.target.value) || 0)
              }
              placeholder={oddsFormat === "decimal" ? "2.00" : oddsFormat === "american" ? "+100" : "1/1"}
            />
          </div>
        </div>

        <Card className="border-purple-900/30 bg-black/60 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Potential Profit</p>
              <p className="text-2xl font-bold text-green-500">${profit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Return</p>
              <p className="text-2xl font-bold text-white">${(stake + profit).toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {!isPremium && (
          <div className="rounded-md bg-purple-900/20 p-4 text-center">
            <p className="text-sm text-purple-300">
              Upgrade to Pro or Elite for advanced calculator features, including fractional odds, implied probability,
              and more.
            </p>
            <Button className="mt-2 bg-purple-600 hover:bg-purple-700">Upgrade Now</Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="conversion" className="mt-4 space-y-4">
        {isPremium ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="decimal-odds">Decimal Odds</Label>
                <Input
                  id="decimal-odds"
                  type="number"
                  value={decimalOdds}
                  onChange={(e) => handleOddsConversion(e.target.value, "decimal")}
                  step="0.01"
                  min="1.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="american-odds">American Odds</Label>
                <Input
                  id="american-odds"
                  type="number"
                  value={americanOdds}
                  onChange={(e) => handleOddsConversion(e.target.value, "american")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fractional-odds">Fractional Odds</Label>
                <Input id="fractional-odds" type="text" value={fractionalOdds} readOnly />
              </div>
            </div>

            <Card className="border-purple-900/30 bg-black/60 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Implied Probability</p>
                  <p className="text-2xl font-bold text-white">{((1 / decimalOdds) * 100).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fair Value</p>
                  <p className="text-2xl font-bold text-white">${(100 / ((1 / decimalOdds) * 100)).toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md bg-purple-900/20 p-4 text-center">
            <Lock className="mb-2 h-8 w-8 text-purple-400" />
            <p className="text-purple-300">This feature is available exclusively for Premium members.</p>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Upgrade to Premium</Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

