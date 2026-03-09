"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface ActionMenuProps {
  resourceId: string
  resourceType: "user" | "post" | "comment" | "report"
  actions: Array<{
    label: string
    icon?: React.ReactNode
    action: "view" | "edit" | "approve" | "reject" | "ban" | "unban" | "delete" | "hide" | "take-action" | "custom"
    onCustomAction?: () => void
    variant?: "default" | "destructive"
  }>
}

export function ActionMenu({ resourceId, resourceType, actions }: ActionMenuProps) {
  const router = useRouter()

  const handleAction = (action: string, onCustomAction?: () => void) => {
    switch (action) {
      case "view":
        router.push(`/admin/${resourceType}s/${resourceId}`)
        break
      case "edit":
        router.push(`/admin/${resourceType}s/${resourceId}/edit`)
        break
      case "custom":
        onCustomAction?.()
        break
      default:
        onCustomAction?.()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <div key={index}>
            <DropdownMenuItem
              onClick={() => handleAction(action.action, action.onCustomAction)}
              className={action.variant === "destructive" ? "text-destructive" : ""}
            >
              {action.label}
            </DropdownMenuItem>
            {index < actions.length - 1 && action.variant === "destructive" && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
