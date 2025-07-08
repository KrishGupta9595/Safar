"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Star, MapPin, ChevronDown, ChevronUp, Navigation } from "lucide-react"
import { ErrorAlert } from "@/components/error-alert"

interface AttractionCardProps {
  destination: string
}

interface Attraction {
  id: string
  name: string
  category: string
  rating: number
  description: string
  details: string
  address: string
  coordinates?: { lat: number; lng: number }
  image?: string
}

export function AttractionCard({ destination }: AttractionCardProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Memoize the destination to prevent unnecessary re-fetches
  const searchDestination = useMemo(() => destination, [destination])

  // Memoize the fetch function to prevent infinite loops
  const fetchAttractions = useCallback(async () => {
    if (!searchDestination) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/attractions?destination=${encodeURIComponent(searchDestination)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch attractions")
      }

      const data = await response.json()
      setAttractions(data.attractions || [])
    } catch (error) {
      console.error("Attractions fetch error:", error)
      setError("Failed to load attractions. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [searchDestination])

  // Effect to fetch attractions when destination changes
  useEffect(() => {
    fetchAttractions()
  }, [fetchAttractions])

  // Memoize category color function to prevent re-renders
  const getCategoryColor = useCallback((category: string) => {
    switch (category.toLowerCase()) {
      case "historical":
        return "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800"
      case "nature":
        return "bg-gradient-to-r from-green-100 to-teal-100 text-green-800"
      case "culture":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
      case "shopping":
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
      case "religious":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800"
      case "entertainment":
        return "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800"
      default:
        return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800"
    }
  }, [])

  // Memoize directions handler to prevent re-renders
  const handleGetDirections = useCallback((attraction: Attraction) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(attraction.name)},${encodeURIComponent(attraction.address)}`
    window.open(mapsUrl, "_blank", "noopener,noreferrer")
  }, [])

  // Memoize toggle handler to prevent re-renders
  const handleToggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  // Memoize error close handler to prevent re-renders
  const handleCloseError = useCallback(() => {
    setError(null)
  }, [])

  if (isLoading) {
    return (
      <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 sm:p-6">
          <CardTitle className="flex items-center space-x-2 sm:space-x-3">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-xl">Top Attractions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 sm:h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-xl">Top Attractions in {destination}</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
            {attractions.length} places
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {error && <ErrorAlert title="Unable to load attractions" message={error} onClose={handleCloseError} />}

        <div className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
          {attractions.map((attraction) => (
            <div
              key={attraction.id}
              className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in"
            >
              {attraction.image && (
                <div className="h-32 sm:h-40 bg-gray-200 rounded-t-2xl overflow-hidden">
                  <img
                    src={attraction.image || "/placeholder.svg"}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(attraction.name)}`
                    }}
                  />
                </div>
              )}

              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                  <h4 className="font-bold text-gray-800 text-base sm:text-lg">{attraction.name}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">{attraction.rating}</span>
                    <span className="text-xs text-gray-500">({Math.floor(attraction.rating * 150)} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                  <Badge className={`${getCategoryColor(attraction.category)} text-xs w-fit`}>
                    {attraction.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs truncate">{attraction.address}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 text-sm sm:text-base">{attraction.description}</p>

                {expandedId === attraction.id && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 mb-3 animate-fade-in">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{attraction.details}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleExpanded(attraction.id)}
                    className="flex-1 rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 text-xs sm:text-sm"
                  >
                    {expandedId === attraction.id ? (
                      <>
                        <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Show Details
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleGetDirections(attraction)}
                    className="gradient-bg hover:opacity-90 text-white rounded-xl px-3 sm:px-4 py-2 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                  >
                    <Navigation className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
