"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut()
      toast({
        title: "Logged out successfully",
        description: "See you next time! 👋",
      })
      router.push("/")
    }

    handleLogout()
  }, [router, supabase.auth, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <p className="text-gray-600 text-lg">Logging you out...</p>
      </div>
    </div>
  )
}
