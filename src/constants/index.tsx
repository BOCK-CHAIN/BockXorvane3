import type React from "react"
import { Bell, CreditCard, FileDuoToneBlack, Home, Settings } from "@/components/icons"

export interface MenuItem {
  title: string
  href: string
  icon: React.ReactNode
  activeColor?: string
  hoverColor?: string
  textColor?: string
  iconColor?: string
}

export const MENU_ITEMS = (workspaceId: string): MenuItem[] => [
  {
    title: "Home",
    href: `/dashboard/${workspaceId}/home`,
    icon: <Home className="h-5 w-5 text-orange-400 group-hover:text-orange-300" />,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "My Library",
    href: `/dashboard/${workspaceId}`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300">
        <FileDuoToneBlack />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Notifications",
    href: `/dashboard/${workspaceId}/notifications`,
    icon: <Bell className="h-5 w-5 text-orange-400 group-hover:text-orange-300" />,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Billing",
    href: `/dashboard/${workspaceId}/billing`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300">
        <CreditCard />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Settings",
    href: `/dashboard/${workspaceId}/settings`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300">
        <Settings />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
]