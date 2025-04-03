"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
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
        
        <nav className="flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/notifications" className="relative">
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Link>
          </Button>
        </nav>
      </div>
      <ToastContainer toasts={toasts?.map(toast => ({ ...toast, onDismiss: () => dismiss(toast.id) }))} dismiss={dismiss} />
    </header>
  );
} 