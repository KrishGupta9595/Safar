"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from "lucide-react"
import { ErrorAlert } from "@/components/error-alert"

interface WeatherCardProps {
  destination: string
  dates: { start: string; end: string }
}

interface WeatherData {
  current: {
    temp: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
  }
  forecast: Array<{
    date: string
    temp: number
    condition: string
    icon: string
    humidity: number
  }>
}

export function WeatherCard({ destination, dates }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Memoize the search key to prevent unnecessary re-fetches
  const searchKey = useMemo(() => {
    if (!destination || !dates.start || !dates.end) return null
    return `${destination}-${dates.start}-${dates.end}`
  }, [destination, dates.start, dates.end])

  // Memoize the fetch function to prevent infinite loops
  const fetchWeather = useCallback(async () => {
    if (!searchKey) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate weather API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate forecast dates
      const startDate = new Date(dates.start)
      const endDate = new Date(dates.end)
      const forecastDays = []

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        forecastDays.push(new Date(d).toISOString().split("T")[0])
      }

      // Mock weather data
      const mockWeather: WeatherData = {
        current: {
          temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
          condition: "Partly Cloudy",
          icon: "partly-cloudy",
          humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
        },
        forecast: forecastDays.map((date) => ({
          date,
          temp: Math.floor(Math.random() * 15) + 18, // 18-33°C
          condition: ["Sunny", "Cloudy", "Partly Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
          icon: ["sunny", "cloudy", "partly-cloudy", "rainy"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        })),
      }

      setWeather(mockWeather)
    } catch (error) {
      console.error("Weather fetch error:", error)
      setError("Unable to load weather data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [searchKey, dates.start, dates.end])

  // Effect to fetch weather when search key changes
  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  // Memoize weather icon function to prevent re-renders
  const getWeatherIcon = useCallback((condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
      case "light rain":
      case "rainy":
        return <CloudRain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
      default:
        return <Cloud className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
    }
  }, [])

  // Memoize error close handler to prevent re-renders
  const handleCloseError = useCallback(() => {
    setError(null)
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="bg-blue-500 text-white p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 sm:space-x-3">
            <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-xl">Weather Forecast</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="h-20 sm:h-24 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 sm:h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden animate-slide-up">
      <CardHeader className="bg-blue-500 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <Thermometer className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl">Weather in {destination}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {error && <ErrorAlert title="Unable to load weather data" message={error} onClose={handleCloseError} />}

        {weather && (
          <div className="space-y-6 sm:space-y-8">
            {/* Current Weather */}
            <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-center mb-4">{getWeatherIcon(weather.current.condition)}</div>
              <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{weather.current.temp}°C</p>
              <p className="text-gray-600 text-base sm:text-lg mb-4">{weather.current.condition}</p>

              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  <span>{weather.current.humidity}%</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span>{weather.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-bold text-gray-800 text-base sm:text-lg">Trip Forecast</h4>
              <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
                {weather.forecast.map((day, index) => (
                  <div
                    key={`${day.date}-${index}`}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {getWeatherIcon(day.condition)}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{day.temp}°C</p>
                        <p className="text-xs sm:text-sm text-gray-600">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{day.humidity}% humidity</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
