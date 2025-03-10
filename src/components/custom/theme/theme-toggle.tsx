"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  size?: "sm" | "default" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  iconSize?: number
  className?: string
  iconColor?: string
}

export function ThemeToggle({
  size = "icon",
  variant = "outline",
  iconSize = 18,
  className = "",
  iconColor = "accent"
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn("cursor-pointer", className)}
    >
      <Sun
        className={`rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-${iconColor}`}
        size={iconSize}
      />
      <Moon
        className={`absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-${iconColor}`}
        size={iconSize}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}