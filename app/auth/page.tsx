import { AuthForm } from "@/components/auth-form"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <div className="gradient-card rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to Roam List</h1>
            <p className="text-gray-600">Join thousands of travelers planning amazing trips</p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  )
}
