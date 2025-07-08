"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { Sparkles, Loader2, Clock, Lightbulb, Lock, Sun, Sunset, Moon } from "lucide-react"

interface AIItineraryProps {
  destination: string
  dates: { start: string; end: string }
}

interface DayActivity {
  time: string
  place: string
  description: string
  duration: string
}

interface ItineraryDay {
  day: number
  date: string
  morning: DayActivity
  afternoon: DayActivity
  evening: DayActivity
  localTips: string[]
}

export function AIItinerary({ destination, dates }: AIItineraryProps) {
  const { user } = useAuth()
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
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

  const getDayDuration = () => {
    const start = new Date(dates.start)
    const end = new Date(dates.end)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const getTimeIcon = (timeOfDay: "morning" | "afternoon" | "evening") => {
    switch (timeOfDay) {
      case "morning":
        return <Sun className="w-5 h-5 text-yellow-500" />
      case "afternoon":
        return <Sunset className="w-5 h-5 text-orange-500" />
      case "evening":
        return <Moon className="w-5 h-5 text-purple-500" />
    }
  }

  const getTimeColor = (timeOfDay: "morning" | "afternoon" | "evening") => {
    switch (timeOfDay) {
      case "morning":
        return "from-yellow-100 to-orange-100 border-yellow-200"
      case "afternoon":
        return "from-orange-100 to-red-100 border-orange-200"
      case "evening":
        return "from-purple-100 to-blue-100 border-purple-200"
    }
  }

  return (
    <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
      <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl">AI-Powered Daily Itinerary</span>
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
              Get a personalized {getDayDuration()}-day itinerary for {destination} with morning, afternoon, and evening
              activities plus local tips.
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
                  AI is planning your perfect days...
                </>
              ) : !user ? (
                <>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Sign in to Generate
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Generate Daily Itinerary
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 max-h-[600px] overflow-y-auto">
            {itinerary.map((day) => (
              <Card key={day.day} className="border-2 border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
                        {day.day}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Day {day.day}</h4>
                        <p className="text-white/80 text-sm">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Morning Activity */}
                  <div className={`bg-gradient-to-r ${getTimeColor("morning")} border-b-2 p-4`}>
                    <div className="flex items-start space-x-3">
                      {getTimeIcon("morning")}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-800">Morning</h5>
                          <span className="text-sm font-medium text-gray-600">{day.morning.time}</span>
                        </div>
                        <h6 className="font-semibold text-gray-800 mb-1">{day.morning.place}</h6>
                        <p className="text-gray-700 text-sm mb-2">{day.morning.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{day.morning.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Afternoon Activity */}
                  <div className={`bg-gradient-to-r ${getTimeColor("afternoon")} border-b-2 p-4`}>
                    <div className="flex items-start space-x-3">
                      {getTimeIcon("afternoon")}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-800">Afternoon</h5>
                          <span className="text-sm font-medium text-gray-600">{day.afternoon.time}</span>
                        </div>
                        <h6 className="font-semibold text-gray-800 mb-1">{day.afternoon.place}</h6>
                        <p className="text-gray-700 text-sm mb-2">{day.afternoon.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{day.afternoon.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Evening Activity */}
                  <div className={`bg-gradient-to-r ${getTimeColor("evening")} border-b-2 p-4`}>
                    <div className="flex items-start space-x-3">
                      {getTimeIcon("evening")}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-800">Evening</h5>
                          <span className="text-sm font-medium text-gray-600">{day.evening.time}</span>
                        </div>
                        <h6 className="font-semibold text-gray-800 mb-1">{day.evening.place}</h6>
                        <p className="text-gray-700 text-sm mb-2">{day.evening.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{day.evening.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Local Tips */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200 p-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 mb-2">Local Tips</h5>
                        <ul className="space-y-1">
                          {day.localTips.map((tip, index) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
