"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AuthForm } from "@/components/auth-form"
import { Sparkles } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="gradient-card border border-white/20 rounded-3xl max-w-md mx-4">
        <DialogHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold gradient-text">Unlock All Features</DialogTitle>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Sign in to save trips, generate packing lists, and access premium features.
          </p>
        </DialogHeader>

        <AuthForm />
      </DialogContent>
    </Dialog>
  )
}
