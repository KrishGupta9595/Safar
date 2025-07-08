import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>

        <p className="text-gray-600 mb-8">
          Looks like you've wandered off the beaten path! The page you're looking for doesn't exist.
        </p>

        <Link href="/">
          <Button className="gradient-bg hover:opacity-90 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
