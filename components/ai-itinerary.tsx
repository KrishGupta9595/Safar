"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Sparkles, Loader2, ChevronDown, ChevronUp, MapPin, Clock, Utensils, Lock } from "lucide-react"

interface AIItineraryProps {
  destination: string
  dates: { start: string; end: string }
}

interface ItineraryDay {
  day: number
  date: string
  attractions: string[]
  restaurants: string[]
  startTime: string
  endTime: string
  description: string
}

export function AIItinerary({ destination, dates }: AIItineraryProps) {
  const { user } = useAuth()
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set())
  const { toast } = useToast()

  const generateItinerary = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate AI-powered itineraries.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          startDate: dates.start,
          endDate: dates.end,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to generate AI-powered itineraries.",
            variant: "destructive",
          })
          return
        }
        throw new Error("Failed to generate itinerary")
      }

      const data = await response.json()
      setItinerary(data.itinerary)
      setExpandedDays(new Set([1])) // Expand first day by default

      toast({
        title: "AI Itinerary Generated! ✨",
        description: "Your personalized day-by-day travel plan is ready.",
      })
    } catch (error) {
      console.error("Itinerary generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(day)) {
      newExpanded.delete(day)
    } else {
      newExpanded.add(day)
    }
    setExpandedDays(newExpanded)
  }

  const getDayDuration = () => {
    const start = new Date(dates.start)
    const end = new Date(dates.end)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl">AI-Powered Itinerary</span>
          {!user && <Lock className="w-4 h-4 sm:w-5 sm:h-5 opacity-75" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {!itinerary.length ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse-slow">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">AI Travel Assistant</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
              Get a personalized {getDayDuration()}-day itinerary for {destination} with attractions, restaurants, and
              perfect timing suggestions.
            </p>
            <Button
              onClick={generateItinerary}
              disabled={isLoading || !user}
              className={`${
                !user ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "gradient-bg hover:opacity-90"
              } text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                  AI is planning your trip...
                </>
              ) : !user ? (
                <>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Sign in to Generate
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Generate Smart Itinerary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
            {itinerary.map((day) => (
              <Collapsible key={day.day} open={expandedDays.has(day.day)} onOpenChange={() => toggleDay(day.day)}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {day.day}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-base sm:text-lg">Day {day.day}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-xs sm:text-sm text-gray-500">
                            <p>
                              {day.startTime} - {day.endTime}
                            </p>
                          </div>
                          {expandedDays.has(day.day) ? (
                            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                  <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border border-purple-100">
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{day.description}</p>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                            <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Top Attractions</h5>
                          </div>
                          <ul className="space-y-1 sm:space-y-2">
                            {day.attractions.map((attraction, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-gray-700 text-xs sm:text-sm">{attraction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-center space-x-2">
                            <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                            <h5 className="font-semibold text-gray-800 text-sm sm:text-base">Recommended Dining</h5>
                          </div>
                          <ul className="space-y-1 sm:space-y-2">
                            {day.restaurants.map((restaurant, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-400 rounded-full"></div>
                                <span className="text-gray-700 text-xs sm:text-sm">{restaurant}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white/50 rounded-xl p-2 sm:p-3">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>
                          Suggested timing: {day.startTime} - {day.endTime}
                        </span>
                      </div>
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
