"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="opacity-0">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-white hover:bg-purple-950/50 hover:text-purple-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-all duration-300 animate-in fade-in" />
        ) : (
          <Moon className="h-5 w-5 transition-all duration-300 animate-in fade-in" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

