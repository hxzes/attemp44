"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(children)
  const [prevPathname, setPrevPathname] = useState(pathname)

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsLoading(true)

      // Store the previous pathname
      setPrevPathname(pathname)

      // Simulate loading delay for smooth transition
      const timer = setTimeout(() => {
        setContent(children)
        setIsLoading(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, prevPathname, children])

  return (
    <div className="relative min-h-screen">
      {/* Loading overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300",
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <LoadingSpinner size="lg" />
      </div>

      {/* Page content with fade transition */}
      <div className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}>{content}</div>
    </div>
  )
}

