"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, Lock, CreditCard, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SectionTransition } from "@/components/section-transition"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("account")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  // Form state
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken")
    const userJson = localStorage.getItem("currentUser")

    if (!token || !userJson) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(userJson)
      setUserData(userData)
      setIsLoggedIn(true)

      // Populate form fields
      setUsername(userData.name || "")
      setEmail(userData.email || "")

      // Simulate page loading
      setTimeout(() => {
        setPageLoading(false)
      }, 500)
    } catch (e) {
      console.error("Failed to parse user data", e)
      router.push("/login")
    }
  }, [router])

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      try {
        // Update user data in localStorage
        const updatedUser = {
          ...userData,
          name: username,
          email: email,
        }

        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUserData(updatedUser)
        setMessage({ type: "success", text: "Profile updated successfully!" })
      } catch (error) {
        setMessage({ type: "error", text: "Failed to update profile. Please try again." })
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match." })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, you would verify the current password and update it
        setMessage({ type: "success", text: "Password updated successfully!" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } catch (error) {
        setMessage({ type: "error", text: "Failed to update password. Please try again." })
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/95">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white animate-slide-in-left">
              Profile Settings
            </h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
              {/* Profile Sidebar */}
              <div className="space-y-6 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
                <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="text-2xl bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50 text-[hsl(var(--premium-badge))] dark:text-purple-300">
                          {userData?.name?.charAt(0).toUpperCase() || <User className="h-12 w-12" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userData?.name}</h2>
                        <p className="text-sm text-muted-foreground">{userData?.email}</p>
                      </div>
                      <div className="w-full">
                        <div className="rounded-md bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/20 px-3 py-2 text-center">
                          <span className="text-xs font-medium text-[hsl(var(--premium-badge))] dark:text-purple-300">
                            {userData?.plan?.charAt(0).toUpperCase() + userData?.plan?.slice(1) || "Basic"} Plan
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="hidden md:block">
                  <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
                    <TabsList className="flex w-full flex-col items-start justify-start">
                      <TabsTrigger
                        value="account"
                        className="w-full justify-start px-3 py-2 data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                      >
                        Account
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className="w-full justify-start px-3 py-2 data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                      >
                        Security
                      </TabsTrigger>
                      <TabsTrigger
                        value="billing"
                        className="w-full justify-start px-3 py-2 data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                      >
                        Billing
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className="md:hidden animate-slide-in-left" style={{ animationDelay: "200ms" }}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="account"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="billing"
                      className="data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                    >
                      Billing
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Content Area */}
              <div className="animate-slide-in-right" style={{ animationDelay: "300ms" }}>
                {message && (
                  <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6 animate-scale">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                <SectionTransition show={activeTab === "account"}>
                  <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Update your account details</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdateProfile}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </SectionTransition>

                <SectionTransition show={activeTab === "security"}>
                  <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Update your password</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdatePassword}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="current-password"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Updating...
                            </>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </SectionTransition>

                <SectionTransition show={activeTab === "billing"}>
                  <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                    <CardHeader>
                      <CardTitle>Subscription Details</CardTitle>
                      <CardDescription>Manage your subscription plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg border border-[hsl(var(--card-light-border))] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {userData?.plan?.charAt(0).toUpperCase() + userData?.plan?.slice(1) || "Basic"} Plan
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {userData?.plan === "basic" ? "$29" : userData?.plan === "pro" ? "$49" : "$99"} / month
                            </p>
                          </div>
                          <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground">Next billing date: April 15, 2025</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h3>
                        <div className="flex items-center space-x-4 rounded-lg border border-[hsl(var(--card-light-border))] p-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50">
                            <CreditCard className="h-5 w-5 text-[hsl(var(--premium-badge))] dark:text-purple-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Cryptocurrency</p>
                            <p className="text-xs text-muted-foreground">Bitcoin (BTC)</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button
                          className="bg-[hsl(var(--premium-badge))] hover:bg-[hsl(var(--premium-badge))/90]"
                          onClick={() => router.push("/subscription")}
                        >
                          Manage Subscription
                        </Button>
                        <Button variant="outline">Billing History</Button>
                      </div>
                    </CardContent>
                  </Card>
                </SectionTransition>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

