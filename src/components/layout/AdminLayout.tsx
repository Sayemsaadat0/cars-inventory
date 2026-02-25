"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "./AdminSidebar"
import { AdminNavbar } from "./AdminNavbar"
import { Toaster } from "sonner"
import { TooltipProvider } from "@radix-ui/react-tooltip"
// import { AdminSidebar } from "./admin-sidebar"
// import { AdminNavbar } from "./admin-navbar"
// import { Sidebar } from "../Sidebar"
// import { Navbar } from "../Navbar"

interface AdminLayoutProps {
  children: React.ReactNode
}

const SIDEBAR_WIDTH_EXPANDED = "w-64"
const SIDEBAR_WIDTH_COLLAPSED = "w-16"

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen ">
        <div className="flex h-screen">
          {/* Sidebar (hidden on small devices) */}
          <div
            className={cn(
              "hidden md:block shrink-0 transition-all duration-300",
              isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED
            )}
          >
            <AdminSidebar
              isCollapsed={isCollapsed}
              onToggleCollapse={handleToggleCollapse}
              isMobile={false}
            />
          </div>

          {/* Main Content Area */}
          <div
            className={cn(
              "flex flex-1 flex-col overflow-hidden transition-all duration-300",
              // isCollapsed ? "ml-4" : "ml-6"
            )}
          >
            {/* Navbar */}
            <AdminNavbar />

            {/* Page Content */}
            <main
              className={cn(
                "flex-1 overflow-auto min-h-screen bg-background transition-all duration-300"
              )}
            >
              <div className=" w-full ">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Toaster />

    </TooltipProvider>
  )
}
