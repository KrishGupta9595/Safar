import Link from "next/link"
import { Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AuthBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-blue-900 font-medium">You're browsing in read-only mode</p>
            <p className="text-blue-700 text-sm">
              Sign in to save trips, generate packing lists, and access hotel booking links.
            </p>
          </div>
        </div>

        <Link href="/auth">
          <Button className="bg-[#3AB795] hover:bg-[#2CA381] text-white">
            Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
