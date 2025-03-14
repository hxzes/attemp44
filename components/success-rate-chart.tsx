"use client"

import { useEffect, useRef } from "react"

export function SuccessRateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Sample data - in a real app, this would come from your database
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const winRates = [75, 78, 80, 82, 79, 85, 87, 86, 89, 88, 90, 87]

    // Chart settings
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const gridLines = 5

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "rgba(120, 58, 180, 0.1)"
    ctx.lineWidth = 1

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (chartHeight / gridLines) * i

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Draw y-axis labels
      const value = 100 - i * (100 / gridLines)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${value}%`, padding - 10, y + 3)
    }

    // Draw x-axis labels
    ctx.textAlign = "center"
    const barWidth = chartWidth / months.length

    months.forEach((month, i) => {
      const x = padding + barWidth * i + barWidth / 2
      ctx.fillText(month, x, canvas.height - padding / 2)
    })

    // Draw line chart
    ctx.strokeStyle = "rgba(120, 58, 180, 0.8)"
    ctx.lineWidth = 3
    ctx.beginPath()

    winRates.forEach((rate, i) => {
      const x = padding + barWidth * i + barWidth / 2
      const y = padding + chartHeight - (rate / 100) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw gradient under the line
    const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight)
    gradient.addColorStop(0, "rgba(120, 58, 180, 0.3)")
    gradient.addColorStop(1, "rgba(120, 58, 180, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()

    // Start from the bottom left
    ctx.moveTo(padding + barWidth / 2, padding + chartHeight)

    // Draw the line again
    winRates.forEach((rate, i) => {
      const x = padding + barWidth * i + barWidth / 2
      const y = padding + chartHeight - (rate / 100) * chartHeight
      ctx.lineTo(x, y)
    })

    // Complete the path to the bottom right
    ctx.lineTo(padding + chartWidth - barWidth / 2, padding + chartHeight)
    ctx.closePath()
    ctx.fill()

    // Draw data points
    ctx.fillStyle = "#9333ea"

    winRates.forEach((rate, i) => {
      const x = padding + barWidth * i + barWidth / 2
      const y = padding + chartHeight - (rate / 100) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw outer glow
      ctx.strokeStyle = "rgba(147, 51, 234, 0.3)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Add animation effect for the latest data point
    let glowSize = 6
    let growing = true

    const animateGlow = () => {
      if (!ctx) return

      // Get the last data point
      const lastIndex = winRates.length - 1
      const x = padding + barWidth * lastIndex + barWidth / 2
      const y = padding + chartHeight - (winRates[lastIndex] / 100) * chartHeight

      // Clear the previous glow
      ctx.clearRect(x - glowSize - 5, y - glowSize - 5, glowSize * 2 + 10, glowSize * 2 + 10)

      // Redraw the data point
      ctx.fillStyle = "#9333ea"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw the animated glow
      ctx.strokeStyle = "rgba(147, 51, 234, 0.3)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, glowSize, 0, Math.PI * 2)
      ctx.stroke()

      // Update glow size
      if (growing) {
        glowSize += 0.2
        if (glowSize >= 12) growing = false
      } else {
        glowSize -= 0.2
        if (glowSize <= 6) growing = true
      }

      requestAnimationFrame(animateGlow)
    }

    animateGlow()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}

