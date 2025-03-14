"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Lock, Mail, User, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SectionTransition } from "@/components/section-transition"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan")

  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(planParam || "basic")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if email already exists
      const usersJson = localStorage.getItem("registeredUsers")
      const users = usersJson ? JSON.parse(usersJson) : []

      if (users.some((user: any) => user.email === email)) {
        throw new Error("An account with this email already exists. Please log in instead.")
      }

      // Create new user
      const newUser = {
        username,
        email,
        password, // In a real app, this would be hashed
        plan: selectedPlan,
        joinDate: new Date().toISOString(),
      }

      // Add to users array
      users.push(newUser)
      localStorage.setItem("registeredUsers", JSON.stringify(users))

      // Set auth token and current user
      localStorage.setItem("authToken", "user-token-" + Date.now())
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email,
          name: username || email.split("@")[0],
          plan: selectedPlan,
        }),
      )

      // Simulate registration delay
      setTimeout(() => {
        setIsLoading(false)
        router.push("/dashboard")
      }, 1500)
    } catch (err: any) {
      setIsLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16 animate-fade-in">
        <Card className="mx-auto w-full max-w-lg border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))] shadow-[0_0_15px_rgba(120,58,180,0.1)] animate-scale">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>Choose your plan and enter your details to get started</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive" className="text-sm animate-scale">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Plan Selection */}
              <div className="space-y-2">
                <Label>Select your plan</Label>
                <Tabs defaultValue={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="basic"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/20] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-white"
                    >
                      Basic
                    </TabsTrigger>
                    <TabsTrigger
                      value="pro"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/20] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-white"
                    >
                      Pro
                    </TabsTrigger>
                    <TabsTrigger
                      value="elite"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/20] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-white"
                    >
                      Elite
                    </TabsTrigger>
                  </TabsList>

                  <SectionTransition show={selectedPlan === "basic"} className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/20 p-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">Basic Plan</h3>
                        <p className="text-sm text-muted-foreground">Standard betting tips and features</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800 dark:text-white">$29</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Standard betting tips</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Basic statistics</span>
                      </li>
                    </ul>
                  </SectionTransition>

                  <SectionTransition show={selectedPlan === "pro"} className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/20 p-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">Pro Plan</h3>
                        <p className="text-sm text-muted-foreground">Premium features and expert tips</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800 dark:text-white">$49</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Expert betting tips</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Real-time notifications</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Advanced bankroll management</span>
                      </li>
                    </ul>
                  </SectionTransition>

                  <SectionTransition show={selectedPlan === "elite"} className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-md bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/20 p-3">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">Elite Plan</h3>
                        <p className="text-sm text-muted-foreground">VIP features and personalized service</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800 dark:text-white">$99</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>All Pro features</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>1-on-1 betting consultation</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Early access to premium tips</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-[hsl(var(--premium-badge))]" />
                        <span>Exclusive VIP community</span>
                      </li>
                    </ul>
                  </SectionTransition>
                </Tabs>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="username"
                        placeholder="johndoe"
                        className="pl-10"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long and include a number and a special character.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[hsl(var(--premium-badge))] hover:text-[hsl(var(--premium-badge))/80]"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link href="#" className="text-[hsl(var(--premium-badge))] hover:text-[hsl(var(--premium-badge))/80]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[hsl(var(--premium-badge))] hover:text-[hsl(var(--premium-badge))/80]">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

