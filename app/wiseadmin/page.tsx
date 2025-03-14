"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Trash,
  Edit,
  Ban,
  UserCog,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"

// Mock data types
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

interface User {
  id: number
  username: string
  email: string
  isPremium: boolean
  joinDate: string
  lastLogin: string
  status: "active" | "banned"
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [tips, setTips] = useState<Tip[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTipDialog, setShowAddTipDialog] = useState(false)
  const [showEditTipDialog, setShowEditTipDialog] = useState(false)
  const [showDeleteTipDialog, setShowDeleteTipDialog] = useState(false)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [currentTip, setCurrentTip] = useState<Tip | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Simulate fetching data from database
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true)

      // Mock data - in a real app, this would be a fetch from your Supabase database
      setTimeout(() => {
        setTips(mockTips)
        setUsers(mockUsers)
        setIsLoading(false)
      }, 1000)
    }

    fetchData()
  }, [])

  // Handle adding a new tip
  const handleAddTip = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send data to your Supabase database
    // and then refresh the tips list

    setShowAddTipDialog(false)
  }

  // Handle editing a tip
  const handleEditTip = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would update the tip in your Supabase database
    // and then refresh the tips list

    setShowEditTipDialog(false)
  }

  // Handle deleting a tip
  const handleDeleteTip = () => {
    // In a real app, this would delete the tip from your Supabase database
    // and then refresh the tips list

    setShowDeleteTipDialog(false)
  }

  // Handle updating a user
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would update the user in your Supabase database
    // and then refresh the users list

    setShowUserDialog(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-purple-900/20 bg-black/80 backdrop-blur-md md:block">
        <div className="flex h-16 items-center border-b border-purple-900/20 px-6">
          <Link href="/wiseadmin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              Wise<span className="text-purple-400">Picks</span>
            </span>
            <Badge className="bg-purple-600 text-white">Admin</Badge>
          </Link>
        </div>

        <nav className="space-y-1 px-2 py-4">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "dashboard"
                ? "bg-purple-900/30 text-white"
                : "text-muted-foreground hover:bg-purple-900/20 hover:text-white"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "tips"
                ? "bg-purple-900/30 text-white"
                : "text-muted-foreground hover:bg-purple-900/20 hover:text-white"
            }`}
            onClick={() => setActiveTab("tips")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Betting Tips
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "users"
                ? "bg-purple-900/30 text-white"
                : "text-muted-foreground hover:bg-purple-900/20 hover:text-white"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-5 w-5" />
            Users
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "settings"
                ? "bg-purple-900/30 text-white"
                : "text-muted-foreground hover:bg-purple-900/20 hover:text-white"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-purple-900/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-600"></div>
              <div className="ml-2">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@wisepicks.eu</p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Button
            variant="ghost"
            className="mt-4 w-full justify-start text-muted-foreground hover:bg-purple-900/20 hover:text-white"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-purple-900/20 bg-black/80 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/wiseadmin" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              Wise<span className="text-purple-400">Picks</span>
            </span>
            <Badge className="bg-purple-600 text-white">Admin</Badge>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="text-white hover:bg-purple-900/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex border-t border-purple-900/20">
          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-3 ${
              activeTab === "dashboard" ? "bg-purple-900/30 text-white" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-3 ${
              activeTab === "tips" ? "bg-purple-900/30 text-white" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("tips")}
          >
            <BarChart3 className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-3 ${
              activeTab === "users" ? "bg-purple-900/30 text-white" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            className={`flex-1 rounded-none py-3 ${
              activeTab === "settings" ? "bg-purple-900/30 text-white" : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-8 pt-24 md:pt-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                  <p className="text-muted-foreground">Manage your betting platform</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">15,423</div>
                    <p className="mt-2 text-xs text-muted-foreground">+124 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Premium Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">3,857</div>
                    <p className="mt-2 text-xs text-muted-foreground">+42 this week</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">24</div>
                    <p className="mt-2 text-xs text-muted-foreground">+8 today</p>
                  </CardContent>
                </Card>

                <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">87%</div>
                    <p className="mt-2 text-xs text-muted-foreground">+2.5% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions and updates on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <div className="mt-1 h-8 w-8 rounded-full bg-purple-900/50 p-1 text-purple-400">
                          {i % 3 === 0 ? (
                            <Users className="h-full w-full" />
                          ) : i % 3 === 1 ? (
                            <BarChart3 className="h-full w-full" />
                          ) : (
                            <Settings className="h-full w-full" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white">
                            {i % 3 === 0
                              ? "New user registered"
                              : i % 3 === 1
                                ? "New betting tip added"
                                : "System settings updated"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {i === 0
                              ? "Just now"
                              : i === 1
                                ? "2 hours ago"
                                : i === 2
                                  ? "5 hours ago"
                                  : i === 3
                                    ? "Yesterday"
                                    : "2 days ago"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === "tips" && (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Betting Tips</h1>
                  <p className="text-muted-foreground">Manage all betting tips and predictions</p>
                </div>

                <Button onClick={() => setShowAddTipDialog(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Tip
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search tips..." className="pl-10" />
                </div>

                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="american-football">American Football</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tips Table */}
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-900/20 hover:bg-purple-900/10">
                        <TableHead>Match</TableHead>
                        <TableHead>Prediction</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Sport</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-purple-900/20 hover:bg-purple-900/10">
                              <TableCell colSpan={7}>
                                <div className="flex animate-pulse space-x-4">
                                  <div className="h-4 w-3/4 rounded bg-purple-900/20"></div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        : tips.map((tip) => (
                            <TableRow key={tip.id} className="border-purple-900/20 hover:bg-purple-900/10">
                              <TableCell>{tip.match}</TableCell>
                              <TableCell>{tip.prediction}</TableCell>
                              <TableCell>{tip.odds.toFixed(2)}</TableCell>
                              <TableCell>{tip.sport}</TableCell>
                              <TableCell>
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
                              </TableCell>
                              <TableCell>
                                {tip.isPremium ? (
                                  <Badge className="bg-purple-600/20 text-purple-400">Premium</Badge>
                                ) : (
                                  <Badge className="bg-gray-600/20 text-gray-400">Free</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                                    onClick={() => {
                                      setCurrentTip(tip)
                                      setShowEditTipDialog(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                    onClick={() => {
                                      setCurrentTip(tip)
                                      setShowDeleteTipDialog(true)
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-purple-900/20 px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1-8</strong> of <strong>24</strong> tips
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-purple-900/30 hover:bg-purple-900/20"
                      disabled
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-purple-900/30 hover:bg-purple-900/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Add Tip Dialog */}
              <Dialog open={showAddTipDialog} onOpenChange={setShowAddTipDialog}>
                <DialogContent className="border-purple-900/30 bg-black/90 sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Add New Betting Tip</DialogTitle>
                    <DialogDescription>Create a new betting tip that will be visible to users.</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddTip} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="match">Match</Label>
                        <Input id="match" placeholder="e.g. Team A vs Team B" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sport">Sport</Label>
                        <Select defaultValue="football" required>
                          <SelectTrigger id="sport">
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="american-football">American Football</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prediction">Prediction</Label>
                      <Textarea id="prediction" placeholder="Enter your prediction" required />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="odds">Odds</Label>
                        <Input id="odds" type="number" step="0.01" min="1.01" placeholder="e.g. 2.00" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue="pending" required>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="premium">Premium</Label>
                        <Select defaultValue="false" required>
                          <SelectTrigger id="premium">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">Free</SelectItem>
                            <SelectItem value="true">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter className="mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddTipDialog(false)}
                        className="border-purple-900/30 hover:bg-purple-900/20"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        Add Tip
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Edit Tip Dialog */}
              <Dialog open={showEditTipDialog} onOpenChange={setShowEditTipDialog}>
                <DialogContent className="border-purple-900/30 bg-black/90 sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Edit Betting Tip</DialogTitle>
                    <DialogDescription>Update the details of this betting tip.</DialogDescription>
                  </DialogHeader>

                  {currentTip && (
                    <form onSubmit={handleEditTip} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="edit-match">Match</Label>
                          <Input id="edit-match" defaultValue={currentTip.match} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-sport">Sport</Label>
                          <Select defaultValue={currentTip.sport.toLowerCase()} required>
                            <SelectTrigger id="edit-sport">
                              <SelectValue placeholder="Select sport" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="football">Football</SelectItem>
                              <SelectItem value="basketball">Basketball</SelectItem>
                              <SelectItem value="tennis">Tennis</SelectItem>
                              <SelectItem value="american-football">American Football</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-prediction">Prediction</Label>
                        <Textarea id="edit-prediction" defaultValue={currentTip.prediction} required />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="edit-odds">Odds</Label>
                          <Input
                            id="edit-odds"
                            type="number"
                            step="0.01"
                            min="1.01"
                            defaultValue={currentTip.odds}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status</Label>
                          <Select defaultValue={currentTip.status || "pending"} required>
                            <SelectTrigger id="edit-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="won">Won</SelectItem>
                              <SelectItem value="lost">Lost</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-premium">Premium</Label>
                          <Select defaultValue={currentTip.isPremium ? "true" : "false"} required>
                            <SelectTrigger id="edit-premium">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="false">Free</SelectItem>
                              <SelectItem value="true">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <DialogFooter className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowEditTipDialog(false)}
                          className="border-purple-900/30 hover:bg-purple-900/20"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {/* Delete Tip Dialog */}
              <Dialog open={showDeleteTipDialog} onOpenChange={setShowDeleteTipDialog}>
                <DialogContent className="border-purple-900/30 bg-black/90 sm:max-w-[450px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Delete Betting Tip</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this betting tip? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>

                  {currentTip && (
                    <div className="space-y-4">
                      <div className="rounded-md bg-red-900/10 p-4">
                        <div className="flex items-start">
                          <AlertTriangle className="mr-3 h-5 w-5 text-red-400" />
                          <div>
                            <h3 className="text-sm font-medium text-red-400">
                              You are about to delete the following tip:
                            </h3>
                            <div className="mt-2 text-sm text-muted-foreground">
                              <p>
                                <strong>Match:</strong> {currentTip.match}
                              </p>
                              <p>
                                <strong>Prediction:</strong> {currentTip.prediction}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowDeleteTipDialog(false)}
                          className="border-purple-900/30 hover:bg-purple-900/20"
                        >
                          Cancel
                        </Button>
                        <Button type="button" onClick={handleDeleteTip} className="bg-red-600 hover:bg-red-700">
                          Delete Tip
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Users</h1>
                  <p className="text-muted-foreground">Manage all registered users</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search users..." className="pl-10" />
                </div>

                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Membership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Users Table */}
              <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-900/20 hover:bg-purple-900/10">
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading
                        ? [...Array(5)].map((_, i) => (
                            <TableRow key={i} className="border-purple-900/20 hover:bg-purple-900/10">
                              <TableCell colSpan={7}>
                                <div className="flex animate-pulse space-x-4">
                                  <div className="h-4 w-3/4 rounded bg-purple-900/20"></div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        : users.map((user) => (
                            <TableRow key={user.id} className="border-purple-900/20 hover:bg-purple-900/10">
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.isPremium ? (
                                  <Badge className="bg-purple-600/20 text-purple-400">Premium</Badge>
                                ) : (
                                  <Badge className="bg-gray-600/20 text-gray-400">Free</Badge>
                                )}
                              </TableCell>
                              <TableCell>{user.joinDate}</TableCell>
                              <TableCell>{user.lastLogin}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    user.status === "active"
                                      ? "bg-green-600/20 text-green-400"
                                      : "bg-red-600/20 text-red-400"
                                  }`}
                                >
                                  {user.status === "active" ? "Active" : "Banned"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
                                    onClick={() => {
                                      setCurrentUser(user)
                                      setShowUserDialog(true)
                                    }}
                                  >
                                    <UserCog className="h-4 w-4" />
                                    <span className="sr-only">Manage</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                  >
                                    <Ban className="h-4 w-4" />
                                    <span className="sr-only">Ban</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-purple-900/20 px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1-8</strong> of <strong>15,423</strong> users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-purple-900/30 hover:bg-purple-900/20"
                      disabled
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-purple-900/30 hover:bg-purple-900/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Manage User Dialog */}
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogContent className="border-purple-900/30 bg-black/90 sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">Manage User</DialogTitle>
                    <DialogDescription>Update user details and manage their account.</DialogDescription>
                  </DialogHeader>

                  {currentUser && (
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue={currentUser.username} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={currentUser.email} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="membership">Membership</Label>
                          <Select defaultValue={currentUser.isPremium ? "premium" : "free"} required>
                            <SelectTrigger id="membership">
                              <SelectValue placeholder="Select membership" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select defaultValue={currentUser.status} required>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">Reset Password</Label>
                        <Input id="new-password" type="password" placeholder="Leave blank to keep current password" />
                        <p className="text-xs text-muted-foreground">
                          Enter a new password only if you want to reset it.
                        </p>
                      </div>

                      <DialogFooter className="mt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowUserDialog(false)}
                          className="border-purple-900/30 hover:bg-purple-900/20"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white">Settings</h1>
                  <p className="text-muted-foreground">Manage platform settings</p>
                </div>
              </div>

              <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="general"
                    className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
                  >
                    General
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
                  >
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="payments"
                    className="data-[state=active]:bg-purple-900/50 data-[state=active]:text-white"
                  >
                    Payments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                  <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>Manage general platform settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input id="site-name" defaultValue="WisePicks" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="site-description">Site Description</Label>
                        <Textarea
                          id="site-description"
                          defaultValue="Premium sports betting insights and strategies for serious bettors."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input id="contact-email" type="email" defaultValue="support@wisepicks.com" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications">
                  <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Configure how notifications are sent to users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="new-tip-notification">New Tip Notification Template</Label>
                        <Textarea
                          id="new-tip-notification"
                          defaultValue="🔥 New Betting Tip: {match} - Check out our latest prediction!"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subscription-reminder">Subscription Reminder Template</Label>
                        <Textarea
                          id="subscription-reminder"
                          defaultValue="⚠️ Your premium subscription will expire in {days} days. Renew now to keep access to exclusive tips!"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="payments">
                  <Card className="border-purple-900/30 bg-black/40 shadow-[0_0_15px_rgba(120,58,180,0.1)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(120,58,180,0.3)]">
                    <CardHeader>
                      <CardTitle>Payment Settings</CardTitle>
                      <CardDescription>Configure cryptocurrency payment options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="btc-address">Bitcoin Wallet Address</Label>
                        <Input id="btc-address" defaultValue="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sol-address">Solana Wallet Address</Label>
                        <Input id="sol-address" defaultValue="5KLmDBGKUYrkQKuKQzXgwpjGAVMjWK4XfFJADKuWZajZ" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="premium-price">Premium Subscription Price (USD)</Label>
                        <Input id="premium-price" type="number" defaultValue="49" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    username: "john_doe",
    email: "john.doe@example.com",
    isPremium: true,
    joinDate: "2023-01-15",
    lastLogin: "2023-03-14 09:45",
    status: "active",
  },
  {
    id: 2,
    username: "jane_smith",
    email: "jane.smith@example.com",
    isPremium: false,
    joinDate: "2023-02-22",
    lastLogin: "2023-03-13 14:30",
    status: "active",
  },
  {
    id: 3,
    username: "mike_johnson",
    email: "mike.johnson@example.com",
    isPremium: true,
    joinDate: "2022-11-05",
    lastLogin: "2023-03-14 11:20",
    status: "active",
  },
  {
    id: 4,
    username: "sarah_williams",
    email: "sarah.williams@example.com",
    isPremium: false,
    joinDate: "2023-03-01",
    lastLogin: "2023-03-12 16:15",
    status: "active",
  },
  {
    id: 5,
    username: "david_brown",
    email: "david.brown@example.com",
    isPremium: true,
    joinDate: "2022-09-18",
    lastLogin: "2023-03-10 08:30",
    status: "active",
  },
  {
    id: 6,
    username: "emily_jones",
    email: "emily.jones@example.com",
    isPremium: false,
    joinDate: "2023-02-05",
    lastLogin: "2023-03-13 19:45",
    status: "banned",
  },
  {
    id: 7,
    username: "alex_miller",
    email: "alex.miller@example.com",
    isPremium: true,
    joinDate: "2022-10-12",
    lastLogin: "2023-03-14 07:20",
    status: "active",
  },
  {
    id: 8,
    username: "olivia_davis",
    email: "olivia.davis@example.com",
    isPremium: false,
    joinDate: "2023-01-28",
    lastLogin: "2023-03-11 12:10",
    status: "active",
  },
]

// Mock data for tips
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

