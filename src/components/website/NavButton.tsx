"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

interface Props {
  variant: "ghost" | "secondary" | "outline" | "default"
  text: string
  href: string
}

export default function NavButton({ variant, text, href }: Props) {
  const router = useRouter()
  return (
    <Button
      className={`px-6 py-5 rounded-full transition duration-300 ease-in-out hover:scale-105 ${
        variant === "default"
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : variant === "outline"
            ? "border-orange-500 text-orange-500 hover:bg-orange-500/10"
            : ""
      }`}
      variant={variant}
      onClick={() => {
        router.push(href)
      }}
    >
      {text}
    </Button>
  )
}

