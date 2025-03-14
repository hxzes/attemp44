"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { AlertCircle, CheckCircle2, HelpCircle, MessageSquare, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Faq } from "@/components/faq"
import { SectionTransition } from "@/components/section-transition"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function SupportPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState("contact")
  const [pageLoading, setPageLoading] = useState(true)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

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
      setIsLoggedIn(true)

      // Populate form fields
      setName(userData.name || "")
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

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would send the support ticket to your backend
        setMessage({
          type: "success",
          text: "Your support ticket has been submitted successfully! We'll get back to you within 24 hours.",
        })
        setSubject("")
        setMessageText("")
      } catch (error) {
        setMessage({ type: "error", text: "Failed to submit your ticket. Please try again." })
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
              Support Center
            </h1>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="data-[state=active]:bg-[hsl(var(--premium-badge))/10] data-[state=active]:text-[hsl(var(--premium-badge))] dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-white"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </TabsTrigger>
              </TabsList>

              <SectionTransition show={activeTab === "contact"}>
                <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                  <CardHeader>
                    <CardTitle>Submit a Support Ticket</CardTitle>
                    <CardDescription>
                      Our support team is here to help. We'll respond to your inquiry within 24 hours.
                    </CardDescription>
                  </CardHeader>

                  <form onSubmit={handleSubmitTicket}>
                    <CardContent className="space-y-4">
                      {message && (
                        <Alert
                          variant={message.type === "error" ? "destructive" : "default"}
                          className="mb-6 animate-scale"
                        >
                          {message.type === "error" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          <AlertDescription>{message.text}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="What is your inquiry about?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Please describe your issue in detail"
                          rows={6}
                          required
                        />
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
                            Submitting...
                          </>
                        ) : (
                          "Submit Ticket"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </SectionTransition>

              <SectionTransition show={activeTab === "faq"}>
                <Card className="border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))]">
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>Find answers to common questions about WisePicks</CardDescription>

                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search FAQs..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Faq />
                  </CardContent>
                </Card>
              </SectionTransition>
            </Tabs>

            <div
              className="mt-8 rounded-lg border border-[hsl(var(--card-light-border))] bg-[hsl(var(--card-light))] p-6 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@wisepicks.eu</p>
                  <p className="mt-1 text-xs text-muted-foreground">Response time: 24 hours</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Premium Support</h3>
                  <p className="text-sm text-muted-foreground">premium@wisepicks.eu</p>
                  <p className="mt-1 text-xs text-muted-foreground">Response time: 4 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

