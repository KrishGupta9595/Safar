"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Trash2, Sparkles, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Trip {
  id: string
  destination: string
  start_date: string
  end_date: string
  created_at: string
}

export default function SavedTripsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTrips()
    }
  }, [user])

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips")
      if (!response.ok) {
        throw new Error("Failed to fetch trips")
      }
      const data = await response.json()
      setTrips(data.trips)
    } catch (error) {
      console.error("Error fetching trips:", error)
      toast({
        title: "Error",
        description: "Failed to load your saved trips.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete trip")
      }

      setTrips((prev) => prev.filter((trip) => trip.id !== tripId))
      toast({
        title: "Trip deleted",
        description: "Your trip has been removed from saved trips.",
      })
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (startDate: string) => {
    const today = new Date()
    const tripStart = new Date(startDate)

    if (tripStart > today) {
      return "bg-gradient-to-r from-green-100 to-teal-100 text-green-800"
    } else {
      return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
    }
  }

  const getStatus = (startDate: string) => {
    const today = new Date()
    const tripStart = new Date(startDate)

    return tripStart > today ? "Upcoming" : "Completed"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
        <header className="gradient-card border-b border-white/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold gradient-text">My Saved Trips</h1>
                </div>
              </div>

              <Link href="/dashboard">
                <Button className="gradient-bg hover:opacity-90 text-white rounded-xl px-6 py-2 transition-all duration-300 transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Plan New Trip
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="gradient-card border border-white/20 shadow-xl rounded-3xl overflow-hidden">
                  <div className="animate-pulse p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <MapPin className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">No trips saved yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start planning your first amazing adventure with Roam List's AI-powered travel assistant!
              </p>
              <Link href="/dashboard">
                <Button className="gradient-bg hover:opacity-90 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Plan Your First Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card
                  key={trip.id}
                  className="gradient-card border border-white/20 shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in"
                >
                  <CardHeader className="gradient-bg text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{trip.destination}</span>
                      <Badge className={getStatusColor(trip.start_date)}>{getStatus(trip.start_date)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(trip.start_date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(trip.end_date).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        Saved {new Date(trip.created_at).toLocaleDateString("en-IN")}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Link
                          href={`/dashboard?destination=${encodeURIComponent(trip.destination)}&start=${trip.start_date}&end=${trip.end_date}`}
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
                          >
                            View Trip
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="rounded-xl border-2 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
