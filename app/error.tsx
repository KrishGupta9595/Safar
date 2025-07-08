"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong!</h1>

        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full gradient-bg hover:opacity-90 text-white rounded-xl py-3 font-semibold transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300"
          >
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  )
}
