"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, User, Settings, CreditCard, LogOut, HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; plan?: string } | null>(null)

  // Check auth status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const hasToken = localStorage.getItem("authToken")
      const userJson = localStorage.getItem("currentUser")

      setIsLoggedIn(!!hasToken)

      if (hasToken && userJson) {
        try {
          const userData = JSON.parse(userJson)
          setUserData(userData)
        } catch (e) {
          console.error("Failed to parse user data", e)
        }
      } else {
        setUserData(null)
      }
    }

    checkAuthStatus()

    // Listen for storage events (in case auth state changes in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "currentUser") {
        checkAuthStatus()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")
    setIsLoggedIn(false)
    setUserData(null)
    router.push("/")
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(120,58,180,0.1)] dark:shadow-[0_0_15px_rgba(120,58,180,0.2)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Wise<span className="text-[hsl(var(--premium-badge))]">Picks</span>
          </span>
          <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50 text-[10px] font-bold text-[hsl(var(--premium-badge))] dark:text-purple-300">
            18+
          </div>
        </Link>

        {/* Desktop Navigation - Center */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/#features"
            className="text-sm text-gray-700 dark:text-white/80 transition-colors hover:text-[hsl(var(--premium-badge))] dark:hover:text-purple-300"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-gray-700 dark:text-white/80 transition-colors hover:text-[hsl(var(--premium-badge))] dark:hover:text-purple-300"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="text-sm text-gray-700 dark:text-white/80 transition-colors hover:text-[hsl(var(--premium-badge))] dark:hover:text-purple-300"
          >
            FAQ
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-700 dark:text-white/80 transition-colors hover:text-[hsl(var(--premium-badge))] dark:hover:text-purple-300"
              >
                Dashboard
              </Link>
              <Link
                href="/support"
                className="text-sm text-gray-700 dark:text-white/80 transition-colors hover:text-[hsl(var(--premium-badge))] dark:hover:text-purple-300"
              >
                Support
              </Link>
            </>
          )}
        </nav>

        {/* Right Side - Theme Toggle and Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          <ThemeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-transparent text-gray-700 dark:text-white">
                      {userData?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50">
                    <User className="h-4 w-4 text-[hsl(var(--premium-badge))] dark:text-purple-300" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userData?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{userData?.email || "user@example.com"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="cursor-pointer flex w-full items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Manage Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support" className="cursor-pointer flex w-full items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-gray-900 dark:text-white hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="bg-[hsl(var(--premium-badge))] text-white hover:bg-[hsl(var(--premium-badge))/90]"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-transparent text-gray-700 dark:text-white">
                      {userData?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--premium-badge))/10] dark:bg-purple-900/50">
                    <User className="h-4 w-4 text-[hsl(var(--premium-badge))] dark:text-purple-300" />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{userData?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{userData?.email || "user@example.com"}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription" className="cursor-pointer flex w-full items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Manage Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/support" className="cursor-pointer flex w-full items-center">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-900 dark:text-white hover:bg-[hsl(var(--premium-badge))/10] dark:hover:bg-purple-950/50"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-[0_8px_15px_rgba(120,58,180,0.1)] dark:shadow-[0_8px_15px_rgba(120,58,180,0.2)] md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/#features"
                className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/support"
                    className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </Link>
                </>
              )}

              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="mr-2 inline-block h-4 w-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/subscription"
                    className="rounded-md px-3 py-2 text-gray-700 dark:text-white/80 transition-colors hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CreditCard className="mr-2 inline-block h-4 w-4" />
                    Manage Subscription
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center rounded-md px-3 py-2 text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start text-gray-900 dark:text-white hover:bg-[hsl(var(--premium-badge))/10] hover:text-[hsl(var(--premium-badge))] dark:hover:bg-purple-950/30 dark:hover:text-purple-300"
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-[hsl(var(--premium-badge))] text-white hover:bg-[hsl(var(--premium-badge))/90]"
                  >
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

