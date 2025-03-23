'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  icon: React.ReactNode
  title: string
  href: string
  selected: boolean
  notifications?: number
  activeColor?: string
  hoverColor?: string,
  textColor?: string,
}

const SidebarItem = ({ href, icon, selected, title, activeColor, hoverColor, textColor }: Props) => {
  const pathname = usePathname()
  const isActive = pathname === href
  // console.log(hoverColor)
  return (
    <li className="cursor-pointer my-[5px]">
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
          isActive ? activeColor : "hover:" + hoverColor,
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {icon}
        <span className={cn(textColor, isActive && "!text-orange-400 font-medium")}>{title}</span>
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
      </Link>
    </li>
  )
}

export default SidebarItem
