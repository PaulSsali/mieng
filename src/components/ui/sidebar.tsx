"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Target,
  FolderOpen,
  FileText,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Sparkles
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

// Function to get user initials
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

interface SidebarProps {
  className?: string
  isCollapsed: boolean
  onCollapse: (collapsed: boolean) => void
  onMenuItemClick?: () => void
}

export function Sidebar({ className, isCollapsed, onCollapse, onMenuItemClick }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Outcomes", href: "/outcomes", icon: Target },
    { label: "Projects", href: "/projects", icon: FolderOpen },
    { label: "Reports", href: "/reports", icon: Sparkles },
    { label: "Referees", href: "/referees", icon: Users },
  ]

  const handleCollapse = () => {
    onCollapse(!isCollapsed)
  }

  // Separate handler that only closes the mobile menu without expanding sidebar
  const handleMenuItemClick = (e: React.MouseEvent) => {
    if (onMenuItemClick) {
      onMenuItemClick()
    }
    
    // Don't expand the sidebar when clicking on menu items while collapsed
    if (isCollapsed) {
      e.stopPropagation()
    }
  }

  const handleLogout = async (e: React.MouseEvent) => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
    
    if (onMenuItemClick) {
      onMenuItemClick()
    }
    
    // Don't expand the sidebar when clicking logout while collapsed
    if (isCollapsed) {
      e.stopPropagation()
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen z-50 overflow-hidden",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2 overflow-hidden">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={handleMenuItemClick} title="Ed60 Dashboard">
            <Image 
              src="/logo.svg" 
              alt="Ed60 Logo" 
              width={100} 
              height={100} 
              className="rounded-sm"
            />
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 transition-transform duration-300 hover:bg-accent"
          onClick={handleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Navigation */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <nav className="space-y-1 py-2 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center rounded-lg transition-all duration-300 relative group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                )}
                title={isCollapsed ? item.label : undefined}
                onClick={handleMenuItemClick}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "text-sm transition-all duration-300 origin-left transform-gpu whitespace-nowrap",
                  isCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
                )}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible whitespace-nowrap z-50 shadow-md">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="border-t p-2">
        <div className="space-y-1">
          <Link
            href="/settings"
            className={cn(
              "flex h-10 items-center rounded-lg transition-all duration-300 relative group",
              pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center px-0" : "px-3 gap-3"
            )}
            title={isCollapsed ? "Settings" : undefined}
            onClick={handleMenuItemClick}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "text-sm transition-all duration-300 origin-left transform-gpu whitespace-nowrap",
              isCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
            )}>
              Settings
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible whitespace-nowrap z-50 shadow-md">
                Settings
              </div>
            )}
          </Link>
          <Link
            href="/help"
            className={cn(
              "flex h-10 items-center rounded-lg transition-all duration-300 relative group",
              pathname === "/help"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center px-0" : "px-3 gap-3"
            )}
            title={isCollapsed ? "Help & Support" : undefined}
            onClick={handleMenuItemClick}
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "text-sm transition-all duration-300 origin-left transform-gpu whitespace-nowrap",
              isCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
            )}>
              Help & Support
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible whitespace-nowrap z-50 shadow-md">
                Help & Support
              </div>
            )}
          </Link>
          <button
            className={cn(
              "flex h-10 items-center rounded-lg transition-all duration-300 relative group w-full",
              "text-destructive hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center px-0" : "px-3 gap-3"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className={cn(
              "text-sm transition-all duration-300 origin-left transform-gpu whitespace-nowrap",
              isCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
            )}>
              Logout
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible whitespace-nowrap z-50 shadow-md">
                Logout
              </div>
            )}
          </button>
        </div>
        
        {/* User Profile */}
        <div className={cn("mt-3 pt-3 border-t", isCollapsed ? "px-0 text-center" : "px-2")}>
          <Link 
            href="/settings" 
            onClick={handleMenuItemClick}
            className="block group"
            title={isCollapsed ? "Your Profile" : undefined}
          >
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              <div className="relative shrink-0">
                {user?.photoURL ? (
                  user.photoURL.includes('ui-avatars.com') ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="rounded-full h-8 w-8 object-cover border border-border"
                    />
                  ) : (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full h-8 w-8 object-cover border border-border"
                    />
                  )
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {user?.displayName ? getInitials(user.displayName) : <User className="h-4 w-4" />}
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
} 