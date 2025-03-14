"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Lock, Mail, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate checking if user exists in localStorage
    try {
      // Get registered users from localStorage
      const usersJson = localStorage.getItem("registeredUsers")
      const users = usersJson ? JSON.parse(usersJson) : []

      // Find user with matching email
      const user = users.find((u: any) => u.email === email)

      if (!user) {
        throw new Error("No account found with this email. Please sign up first.")
      }

      // In a real app, you would hash and compare passwords
      if (user.password !== password) {
        throw new Error("Incorrect password. Please try again.")
      }

      // Successful login
      setTimeout(() => {
        // Store auth token and user info
        localStorage.setItem("authToken", "user-token-" + Date.now())
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            name: user.username || email.split("@")[0],
            plan: user.plan || "basic",
          }),
        )

        setIsLoading(false)
        router.push("/dashboard")
      }, 1000)
    } catch (err: any) {
      setIsLoading(false)
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-24 animate-fade-in">
        <Card className="mx-auto w-full max-w-md border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))] shadow-[0_0_15px_rgba(120,58,180,0.1)] animate-scale">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="text-sm animate-scale">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[hsl(var(--premium-badge))] hover:text-[hsl(var(--premium-badge))/80]"
                  >
                    Forgot password?
                  </Link>
                </div>
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
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
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
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-[hsl(var(--premium-badge))] hover:text-[hsl(var(--premium-badge))/80]"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

