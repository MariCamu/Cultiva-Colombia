"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(newTheme);
  };
  
  if (isMobile) {
    return (
        <Button variant="outline" className="w-full justify-start gap-2" onClick={toggleTheme}>
            {theme === 'light' && <Sun className="h-5 w-5" />}
            {theme === 'dark' && <Moon className="h-5 w-5" />}
            {theme === 'system' && <Monitor className="h-5 w-5" />}
            <span>
                Cambiar a tema {theme === 'light' ? 'Oscuro' : theme === 'dark' ? 'Sistema' : 'Claro'}
            </span>
        </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
