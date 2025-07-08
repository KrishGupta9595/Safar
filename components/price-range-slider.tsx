"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { IndianRupee } from "lucide-react"

interface PriceRangeSliderProps {
  minPrice: number
  maxPrice: number
  onPriceChange: (range: [number, number]) => void
}

export function PriceRangeSlider({ minPrice, maxPrice, onPriceChange }: PriceRangeSliderProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice])

  // Use ref to track if this is the initial mount to prevent loops
  const isInitialMount = useRef(true)

  // Use ref to track previous props to prevent unnecessary updates
  const prevProps = useRef({ minPrice, maxPrice })

  // Only update price range when props actually change, not on every render
  useEffect(() => {
    const propsChanged = prevProps.current.minPrice !== minPrice || prevProps.current.maxPrice !== maxPrice

    if (propsChanged) {
      // Update the price range to match new bounds
      const newRange: [number, number] = [minPrice, maxPrice]
      setPriceRange(newRange)

      // Only call onPriceChange if this is not the initial mount to prevent loops
      if (!isInitialMount.current) {
        onPriceChange(newRange)
      }

      // Update previous props
      prevProps.current = { minPrice, maxPrice }
    }

    // Mark that initial mount is complete
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
  }, [minPrice, maxPrice, onPriceChange])

  // Handle slider value changes - memoized to prevent re-renders
  const handlePriceChange = useCallback(
    (value: number[]) => {
      const newRange: [number, number] = [value[0], value[1]]

      // Only update if the range actually changed
      setPriceRange((prevRange) => {
        if (prevRange[0] !== newRange[0] || prevRange[1] !== newRange[1]) {
          // Call parent callback with new range
          onPriceChange(newRange)
          return newRange
        }
        return prevRange
      })
    },
    [onPriceChange],
  )

  // Memoize price formatting to prevent re-renders
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  // Don't render if we don't have valid price bounds
  if (maxPrice <= minPrice) {
    return null
  }

  return (
    <Card className="gradient-card border border-white/20 shadow-xl rounded-2xl p-4 sm:p-6 mb-6 animate-fade-in">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-xl flex items-center justify-center">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold gradient-text">Price Range Filter</h3>
            <p className="text-xs sm:text-sm text-gray-600">Adjust to filter hotels by price per night</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={maxPrice}
              min={minPrice}
              step={500}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-xl flex-1 text-center">
              <span className="text-purple-700 font-semibold">Min: {formatPrice(priceRange[0])}</span>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-2 rounded-xl flex-1 text-center">
              <span className="text-blue-700 font-semibold">Max: {formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
