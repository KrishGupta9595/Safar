import Link from "next/link"
import { MapPin, Calendar, Luggage, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-teal-300 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover amazing destinations with AI-powered weather forecasts, curated attractions, hotel bookings, and
            smart packing lists - all in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 px-10 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <MapPin className="w-6 h-6 mr-3" />
                Start Planning
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>

            <Link href="/auth">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 bg-transparent backdrop-blur-sm"
              >
                Join Free
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: MapPin, title: "Smart Discovery", desc: "AI-curated destinations" },
              { icon: Calendar, title: "Perfect Timing", desc: "Weather-based planning" },
              { icon: Luggage, title: "Smart Packing", desc: "Personalized checklists" },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
