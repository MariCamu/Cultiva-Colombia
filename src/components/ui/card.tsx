
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Default rounded-lg as per spec (8px via --radius)
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement, // Changed from HTMLParagraphElement to HTMLDivElement for flexibility with h tags
  React.HTMLAttributes<HTMLHeadingElement> // Changed from HTMLParagraphElement
>(({ className, children, ...props }, ref) => ( // Added children to allow passing h-tags
  <div // Changed from h3 to div
    ref={ref}
    className={cn(
      "text-2xl font-nunito font-bold leading-none tracking-tight", // Applied Nunito Bold
      className
    )}
    {...props}
  >
    {children} 
  </div>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Kept as HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement> // Kept as HTMLParagraphElement
>(({ className, ...props }, ref) => (
  <p // Changed from div to p for semantic correctness
    ref={ref}
    className={cn("text-sm text-muted-foreground font-sans", className)} // Explicitly Merriweather (font-sans)
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 font-sans", className)} {...props} /> // Explicitly Merriweather
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
