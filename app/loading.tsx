import { Loader2, Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-5 h-5 text-white animate-spin" />
        </div>
        <p className="text-gray-600 text-lg">Loading your adventure...</p>
      </div>
    </div>
  )
}
