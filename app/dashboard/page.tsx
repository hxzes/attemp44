"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { BettingCalculator } from "@/components/betting-calculator"
import { SuccessRateChart } from "@/components/success-rate-chart"
import { TipsList } from "@/components/tips-list"
import { UpgradeModal } from "@/components/upgrade-modal"
import { TrendingUp, Trophy, CreditCard, Wallet, Lock } from "lucide-react"

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  // Simulate fetching user data
  useEffect(() => {
    // In a real app, this would be a fetch from your Supabase database
    const checkUserStatus = () => {
      // Mock data - in production this would come from your database
      setIsPremium(false) // Default to free tier
    }

    checkUserStatus()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to WisePicks</p>
            </div>

            {!isPremium && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="group animate-pulse-slow bg-gradient-to-r from-[hsl(var(--premium-badge))] to-[hsl(var(--premium-badge))/80] text-white hover:from-[hsl(var(--premium-badge))/90] hover:to-[hsl(var(--premium-badge))/70]"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-purple-300"></span>
                Upgrade to Premium
              </Button>
            )}
          </div>

          {/* Main Dashboard Content */}
          {/*
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white">
                Betting Tips
              </TabsTrigger>
              <TabsTrigger
                value="calculator"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Calculator
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
              >
                Statistics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            /*
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              /*
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-purple-400" />
                      <div className="text-2xl font-bold text-white">87%</div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+2.5% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Recent Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Trophy className="mr-2 h-4 w-4 text-purple-400" />
                      <div className="text-2xl font-bold text-white">24</div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Last 7 days</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Membership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-purple-400" />
                      <div className="text-2xl font-bold text-white">{isPremium ? "Premium" : "Free"}</div>
                    </div>
                    {!isPremium && (
                      <Button
                        variant="link"
                        className="mt-1 h-auto p-0 text-xs text-purple-400"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Upgrade now
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Bankroll</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Wallet className="mr-2 h-4 w-4 text-purple-400" />
                      <div className="text-2xl font-bold text-white">$1,250</div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">+$320 this month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Tips and Success Rate */}
              /*
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader>
                    <CardTitle>Recent Tips</CardTitle>
                    <CardDescription>Latest betting recommendations from our experts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TipsList limit={5} isPremium={isPremium} />
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full border-purple-900/30 hover:bg-purple-900/20">
                      <Link href="/dashboard?tab=tips">View All Tips</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader>
                    <CardTitle>Success Rate</CardTitle>
                    <CardDescription>Your betting performance over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <SuccessRateChart />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tips Tab */}
            /*
            <TabsContent value="tips">
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardHeader>
                  <CardTitle>All Betting Tips</CardTitle>
                  <CardDescription>Browse all available betting tips and predictions</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <TipsList isPremium={isPremium} />
                  {!isPremium && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--premium-overlay))] backdrop-blur-md dark:bg-black/80">
                      <div className="text-center max-w-md p-6">
                        <Lock className="mx-auto mb-4 h-12 w-12 text-[hsl(var(--premium-badge))]" />
                        <h3 className="text-xl font-bold text-[hsl(var(--premium-overlay-text))] dark:text-white mb-2">
                          Premium Content Locked
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Upgrade to a premium plan to access all betting tips and maximize your winning potential.
                        </p>
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]"
                        >
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculator Tab */}
            /*
            <TabsContent value="calculator">
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardHeader>
                  <CardTitle>Betting Calculator</CardTitle>
                  <CardDescription>Calculate potential profits and convert odds formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <BettingCalculator isPremium={isPremium} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            /*
            <TabsContent value="stats">
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardHeader>
                  <CardTitle>Performance Statistics</CardTitle>
                  <CardDescription>Detailed analysis of your betting performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="h-[300px]">
                      <SuccessRateChart />
                    </div>
                    <div className="space-y-4">
                      <Card className="border-purple-900/30 bg-black/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Win Rate</p>
                              <p className="text-2xl font-bold text-white">87%</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total Bets</p>
                              <p className="text-2xl font-bold text-white">142</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Profit</p>
                              <p className="text-2xl font-bold text-green-500">+$1,250</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">ROI</p>
                              <p className="text-2xl font-bold text-white">24.5%</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-900/30 bg-black/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Sport Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Football</span>
                              <span className="text-sm font-medium text-white">92%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-purple-900/20">
                              <div className="h-full w-[92%] rounded-full bg-purple-600"></div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Basketball</span>
                              <span className="text-sm font-medium text-white">85%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-purple-900/20">
                              <div className="h-full w-[85%] rounded-full bg-purple-600"></div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm">Tennis</span>
                              <span className="text-sm font-medium text-white">78%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-purple-900/20">
                              <div className="h-full w-[78%] rounded-full bg-purple-600"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          */
          
          
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Dashboard</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-black/40 border-purple-900/30 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)] p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Recent Tips</h2>
                <p className="text-gray-500">You don't have access to premium tips.</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-[hsl(var(--premium-badge))] to-[hsl(var(--premium-badge))/80] text-white hover:from-[hsl(var(--premium-badge))/90] hover:to-[hsl(var(--premium-badge))/70]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Upgrade to Premium
                </Button>
              </div>
              
              <div className="bg-black/40 border-purple-900/30 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)] p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Statistics</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className="font-medium text-white">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tips This Month:</span>
                    <span className="font-medium text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successful Tips:</span>
                    <span className="font-medium text-white">16</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 border-purple-900/30 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)] p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Account</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-yellow-600 font-medium">Free Tier</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium text-white">Nov 2023</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full border-purple-900/30 text-white hover:bg-purple-900/20"
                  onClick={() => setIsModalOpen(true)}
                >
                  View Premium Plans
                </Button>
              </div>
            </div>
            
            
          </div>
        </div>
      </main>

      <UpgradeModal
  open = { isModalOpen }
  onOpenChange={setIsModalOpen} />
  </div>
  )
}

