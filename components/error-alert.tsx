"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorAlertProps {
  title: string
  message: string
  onClose?: () => void
}

export function ErrorAlert({ title, message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-red-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
