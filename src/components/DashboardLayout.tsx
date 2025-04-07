"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { MainHeader } from "@/components/MainHeader";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    // Check on initial load
    checkIfMobile();

    // Set up event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle mobile menu item selection - only closes mobile menu
  const handleMobileMenuSelect = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
    // Do not change the collapsed state when navigation happens
  };

  // Handle sidebar toggle for collapsible state
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 hidden md:block`}>
        <Sidebar
          isCollapsed={isCollapsed}
          onCollapse={handleSidebarToggle}
        />
      </div>

      {/* Mobile full-screen sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-full max-w-full bg-background">
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4 z-50" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <Sidebar
              isCollapsed={false}
              onCollapse={() => {}}
              onMenuItemClick={handleMobileMenuSelect}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {/* Main content area with header and scrollable content */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: isMobile ? '0' : (isCollapsed ? '4rem' : '16rem') }}
      >
        <MainHeader 
          showMobileMenu={isMobile}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 