"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell, User, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

interface MainHeaderProps {
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
}

export function MainHeader({ showMobileMenu = false, onMobileMenuClick }: MainHeaderProps) {
  const { toast, dismiss, toasts } = useToast();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New Project Added",
      message: "Water Treatment Plant Upgrade has been added to your projects.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Report Ready",
      message: "Your TER 1 Report is ready for review.",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Referee Response",
      message: "Robert Mkhize has provided feedback on your ECSA Outcomes Report.",
      time: "1 day ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b bg-background w-full">
      <div className="flex h-16 items-center px-4 md:px-6">
        {showMobileMenu && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden" 
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
        <div className="flex-1" />
        
        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      <ToastContainer toasts={toasts?.map(toast => ({ ...toast, onDismiss: () => dismiss(toast.id) }))} dismiss={dismiss} />
    </header>
  );
} 