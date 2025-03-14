"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-spinner"

interface SectionTransitionProps {
  children: React.ReactNode
  show: boolean
  className?: string
}

export function SectionTransition({ children, show, className }: SectionTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState(children)
  const [prevShow, setPrevShow] = useState(show)

  useEffect(() => {
    if (show !== prevShow) {
      setIsLoading(true)

      // Store the previous show state
      setPrevShow(show)

      // Simulate loading delay for smooth transition
      const timer = setTimeout(() => {
        setContent(children)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [show, prevShow, children])

  if (!show) return null

  return (
    <div className={cn("relative", className)}>
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      ) : (
        <div className="animate-fadeIn">{content}</div>
      )}
    </div>
  )
}

