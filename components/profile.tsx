"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, User, MapPin, Calendar, Trash2, Sparkles } from "lucide-react"

export function Profile() {
  const { user } = useAuth()
  const [savedTrips, setSavedTrips] = useState<any[]>([])

  useEffect(() => {
    // In a real app, fetch saved trips from Supabase
    setSavedTrips([
      {
        id: 1,
        destination: "Goa, India",
        dates: { start: "2024-06-15", end: "2024-06-22" },
        createdAt: "2024-01-15",
        status: "upcoming",
      },
      {
        id: 2,
        destination: "Kerala, India",
        dates: { start: "2024-08-10", end: "2024-08-20" },
        createdAt: "2024-01-20",
        status: "planning",
      },
      {
        id: 3,
        destination: "Rajasthan, India",
        dates: { start: "2024-03-05", end: "2024-03-12" },
        createdAt: "2024-01-10",
        status: "completed",
      },
    ])
  }, [])

  const handleDeleteTrip = (tripId: number) => {
    setSavedTrips((prev) => prev.filter((trip) => trip.id !== tripId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "from-green-500 to-teal-500"
      case "planning":
        return "from-blue-500 to-cyan-500"
      case "completed":
        return "from-gray-500 to-gray-600"
      default:
        return "from-purple-500 to-pink-500"
    }
  }

  return (
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">My Profile</h1>
              </div>
            </div>

            <Link href="/logout">
              <Button
                variant="outline"
                className="rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
              >
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="gradient-card border border-white/20 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="gradient-bg text-white">
                <CardTitle className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6" />
                  <span>Account Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{user?.email?.charAt(0).toUpperCase()}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{user?.email}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Member Since
                      </label>
                      <p className="text-gray-800 font-medium">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Recently"}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Saved Trips</label>
                      <p className="text-2xl font-bold gradient-text">{savedTrips.length}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Countries Visited
                      </label>
                      <p className="text-2xl font-bold gradient-text">1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="gradient-card border border-white/20 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="gradient-bg text-white">
                <CardTitle className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6" />
                  <span>My Travel Adventures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {savedTrips.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MapPin className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">No trips yet</h3>
                    <p className="text-gray-600 mb-6">Start planning your first amazing adventure!</p>
                    <Link href="/dashboard">
                      <Button className="gradient-bg hover:opacity-90 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105">
                        Plan Your First Trip
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {savedTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="font-bold text-gray-800 text-xl">{trip.destination}</h3>
                                <Badge
                                  className={`bg-gradient-to-r ${getStatusColor(trip.status)} text-white border-0 capitalize`}
                                >
                                  {trip.status}
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4" />
                                  <span className="font-medium">
                                    {new Date(trip.dates.start).toLocaleDateString("en-IN", {
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {new Date(trip.dates.end).toLocaleDateString("en-IN", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  Saved {new Date(trip.createdAt).toLocaleDateString("en-IN")}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/dashboard?destination=${encodeURIComponent(trip.destination)}&start=${trip.dates.start}&end=${trip.dates.end}`}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
