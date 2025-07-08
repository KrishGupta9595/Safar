"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/components/auth-provider"
import { TripSearchForm } from "@/components/trip-search-form"
import { WeatherCard } from "@/components/weather-card"
import { AttractionCard } from "@/components/attraction-card"
import { HotelCard } from "@/components/hotel-card"
import { PackingListCard } from "@/components/packing-list-card"
import { AIItinerary } from "@/components/ai-itinerary"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Save, Sparkles, User, MapPin, Menu, X } from "lucide-react"

interface TripData {
  destination: string
  dates: {
    start: string
    end: string
  }
}

export function Dashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tripData, setTripData] = useState<TripData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleTripSearch = useCallback(
    async (searchData: TripData) => {
      setIsLoading(true)
      try {
        // Simulate API calls
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setTripData(searchData)
        toast({
          title: "Trip data loaded! 🎉",
          description: "Found amazing recommendations for your destination.",
        })
      } catch (error) {
        console.error("Trip search error:", error)
        toast({
          title: "Error",
          description: "Failed to fetch trip data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const handleSaveTrip = useCallback(async () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!tripData) {
      toast({
        title: "No trip to save",
        description: "Please search for a destination first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: tripData.destination,
          startDate: tripData.dates.start,
          endDate: tripData.dates.end,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save trip")
      }

      toast({
        title: "Trip saved! ✨",
        description: "Your amazing trip has been saved to your profile.",
      })
    } catch (error) {
      console.error("Save trip error:", error)
      toast({
        title: "Error",
        description: "Failed to save trip. Please try again.",
        variant: "destructive",
      })
    }
  }, [user, tripData, toast])

  const handleAuthRequired = useCallback(() => {
    setShowAuthModal(true)
  }, [])

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <header className="gradient-card border-b border-white/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold gradient-text">Roam List</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {tripData && (
                <Button
                  onClick={handleSaveTrip}
                  className="gradient-bg hover:opacity-90 text-white rounded-xl px-4 sm:px-6 py-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Save Trip
                </Button>
              )}

              {user ? (
                <>
                  <Link href="/saved-trips">
                    <Button
                      variant="outline"
                      className="rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent text-sm sm:text-base"
                    >
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Saved Trips
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="outline"
                      className="rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent text-sm sm:text-base"
                    >
                      <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/auth">
                  <Button className="gradient-bg hover:opacity-90 text-white rounded-xl px-4 sm:px-6 py-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMobileMenu}
                className="rounded-xl border-2 bg-transparent"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              {tripData && (
                <Button
                  onClick={handleSaveTrip}
                  className="w-full gradient-bg hover:opacity-90 text-white rounded-xl py-2 transition-all duration-300 text-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Trip
                </Button>
              )}

              {user ? (
                <>
                  <Link href="/saved-trips" className="block">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent text-sm"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Saved Trips
                    </Button>
                  </Link>
                  <Link href="/profile" className="block">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent text-sm"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/auth" className="block">
                  <Button className="w-full gradient-bg hover:opacity-90 text-white rounded-xl py-2 transition-all duration-300 text-sm">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!user && (
          <div className="gradient-card rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-900 font-semibold text-base sm:text-lg">You're exploring in guest mode</p>
                  <p className="text-blue-700 text-sm sm:text-base">
                    Sign in to save trips, generate packing lists, and unlock all features.
                  </p>
                </div>
              </div>

              <Link href="/auth">
                <Button className="gradient-bg hover:opacity-90 text-white rounded-xl px-4 sm:px-6 py-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                  Sign In Free
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6 sm:space-y-8">
          <TripSearchForm onSearch={handleTripSearch} isLoading={isLoading} />

          {tripData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 animate-fade-in">
              <WeatherCard destination={tripData.destination} dates={tripData.dates} />
              <AttractionCard destination={tripData.destination} />
              <HotelCard destination={tripData.destination} dates={tripData.dates} />
              <PackingListCard
                destination={tripData.destination}
                dates={tripData.dates}
                disabled={!user}
                onAuthRequired={handleAuthRequired}
              />
              <div className="lg:col-span-2">
                <AIItinerary destination={tripData.destination} dates={tripData.dates} />
              </div>
            </div>
          )}
        </div>
      </main>

      <AuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </div>
  )
}
