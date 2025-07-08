"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Hotel, Star, Wifi, Car, Coffee, ExternalLink, Loader2, Utensils, Dumbbell, Waves } from "lucide-react"
import { ErrorAlert } from "@/components/error-alert"
import { PriceRangeSlider } from "@/components/price-range-slider"

interface HotelCardProps {
  destination: string
  dates: { start: string; end: string }
}

interface HotelData {
  id: string
  name: string
  rating: number
  price: number
  amenities: string[]
  image: string
  bookingUrl: string
  address: string
}

export function HotelCard({ destination, dates }: HotelCardProps) {
  const [allHotels, setAllHotels] = useState<HotelData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])

  // Separate state for price bounds to prevent loops
  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number }>({ min: 0, max: 50000 })

  const hotelsEndRef = useRef<HTMLDivElement>(null)

  // Memoize the search key to prevent unnecessary re-fetches
  const searchKey = useMemo(() => `${destination}-${dates.start}-${dates.end}`, [destination, dates.start, dates.end])

  // Fetch hotels function - memoized to prevent infinite loops
  const fetchHotels = useCallback(
    async (page: number, reset = false) => {
      if (reset) {
        setIsLoading(true)
        setCurrentPage(1)
      } else {
        setIsLoadingMore(true)
      }
      setError(null)

      try {
        const response = await fetch(
          `/api/hotels?destination=${encodeURIComponent(destination)}&checkin=${dates.start}&checkout=${dates.end}&page=${page}&limit=6`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch hotels")
        }

        const data = await response.json()

        if (reset) {
          setAllHotels(data.hotels)
          // Calculate price bounds only when fetching new data
          if (data.hotels.length > 0) {
            const prices = data.hotels.map((h: HotelData) => h.price)
            const min = 0 // Always start from 0
            const max = Math.max(...prices)

            // Only update bounds if they actually changed to prevent loops
            setPriceBounds((prevBounds) => {
              if (prevBounds.min !== min || prevBounds.max !== max) {
                return { min, max }
              }
              return prevBounds
            })

            // Set initial price range only if it's different
            setPriceRange((prevRange) => {
              if (prevRange[0] !== min || prevRange[1] !== max) {
                return [min, max]
              }
              return prevRange
            })
          }
        } else {
          setAllHotels((prev) => [...prev, ...data.hotels])
          // Smooth scroll to new hotels
          setTimeout(() => {
            hotelsEndRef.current?.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }

        setHasMore(data.hasMore)
        setCurrentPage(page)
      } catch (error) {
        console.error("Hotels fetch error:", error)
        setError("Unable to load hotel data. Please try again later.")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [destination, dates.start, dates.end],
  )

  // Effect to fetch hotels when search parameters change
  useEffect(() => {
    fetchHotels(1, true)
  }, [searchKey, fetchHotels])

  // Memoize filtered hotels to prevent unnecessary recalculations
  const filteredHotels = useMemo(() => {
    return allHotels.filter((hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1])
  }, [allHotels, priceRange])

  // Handle price range changes - memoized to prevent loops
  const handlePriceChange = useCallback((range: [number, number]) => {
    // Only update if the range actually changed
    setPriceRange((prevRange) => {
      if (prevRange[0] !== range[0] || prevRange[1] !== range[1]) {
        return range
      }
      return prevRange
    })
  }, [])

  // Handle load more - memoized to prevent loops
  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchHotels(currentPage + 1, false)
    }
  }, [isLoadingMore, hasMore, currentPage, fetchHotels])

  // Handle booking click - memoized to prevent loops
  const handleBookingClick = useCallback((bookingUrl: string) => {
    window.open(bookingUrl, "_blank", "noopener,noreferrer")
  }, [])

  // Handle error close - memoized to prevent loops
  const handleCloseError = useCallback(() => {
    setError(null)
  }, [])

  // Memoize amenity icon function to prevent re-renders
  const getAmenityIcon = useCallback((amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />
      case "parking":
        return <Car className="w-3 h-3 sm:w-4 sm:h-4" />
      case "breakfast":
        return <Coffee className="w-3 h-3 sm:w-4 sm:h-4" />
      case "restaurant":
        return <Utensils className="w-3 h-3 sm:w-4 sm:h-4" />
      case "gym":
        return <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" />
      case "pool":
        return <Waves className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return null
    }
  }, [])

  // Memoize price formatting to prevent re-renders
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardTitle className="flex items-center space-x-3">
              <Hotel className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-xl">Hotels</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-16 sm:h-20 bg-gray-200 rounded-2xl"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 sm:h-28 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Price Range Slider - only show if we have hotels */}
      {allHotels.length > 0 && (
        <PriceRangeSlider minPrice={priceBounds.min} maxPrice={priceBounds.max} onPriceChange={handlePriceChange} />
      )}

      <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6">
          <CardTitle className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Hotel className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-xl">Hotels in {destination}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs sm:text-sm">
              {filteredHotels.length} found
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {error && <ErrorAlert title="Unable to load hotel data" message={error} onClose={handleCloseError} />}

          <div className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 text-base sm:text-lg mb-2 truncate">{hotel.name}</h4>
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-700">{hotel.rating}</span>
                        <span className="text-xs text-gray-500 ml-2">({Math.floor(hotel.rating * 200)} reviews)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{hotel.address}</p>
                    </div>
                    <div className="text-right sm:text-right">
                      <p className="text-2xl sm:text-3xl font-bold gradient-text">{formatPrice(hotel.price)}</p>
                      <p className="text-xs text-gray-500">per night</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {hotel.amenities.map((amenity: string) => (
                      <Badge
                        key={amenity}
                        variant="outline"
                        className="flex items-center space-x-1 border-purple-200 text-purple-700 text-xs"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full gradient-bg hover:opacity-90 text-white rounded-xl py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleBookingClick(hotel.bookingUrl)}
                  >
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    View & Book Hotel
                  </Button>
                </div>
              </div>
            ))}

            <div ref={hotelsEndRef} />

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="rounded-xl border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent text-sm sm:text-base"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading more hotels...
                    </>
                  ) : (
                    "View More Hotels"
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
