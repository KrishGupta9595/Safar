"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, MapPin, Calendar, Sparkles } from "lucide-react"

interface TripSearchFormProps {
  onSearch: (data: {
    destination: string
    dates: {
      start: string
      end: string
    }
  }) => void
  isLoading: boolean
}

export function TripSearchForm({ onSearch, isLoading }: TripSearchFormProps) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (formData.destination && formData.startDate && formData.endDate) {
        // Validate dates
        const startDate = new Date(formData.startDate)
        const endDate = new Date(formData.endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (startDate < today) {
          alert("Start date cannot be in the past")
          return
        }

        if (endDate <= startDate) {
          alert("End date must be after start date")
          return
        }

        onSearch({
          destination: formData.destination,
          dates: {
            start: formData.startDate,
            end: formData.endDate,
          },
        })
      }
    },
    [formData, onSearch],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }, [])

  const todayDate = getTodayDate()

  return (
    <Card className="bg-white border border-gray-200 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="gradient-bg text-white p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-lg sm:text-2xl">Plan Your Perfect Trip</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="destination"
                className="flex items-center space-x-2 text-gray-700 font-semibold text-sm sm:text-base"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>Destination</span>
              </Label>
              <div className="relative">
                <Input
                  id="destination"
                  name="destination"
                  type="text"
                  placeholder="Where do you want to explore?"
                  value={formData.destination}
                  onChange={handleInputChange}
                  required
                  className="h-10 sm:h-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 transition-colors pl-4 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="startDate"
                className="flex items-center space-x-2 text-gray-700 font-semibold text-sm sm:text-base"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>Start Date</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                min={todayDate}
                className="h-10 sm:h-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="endDate"
                className="flex items-center space-x-2 text-gray-700 font-semibold text-sm sm:text-base"
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>End Date</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={formData.startDate || todayDate}
                className="h-10 sm:h-12 rounded-xl border-2 border-gray-300 focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="text-center">
            <Button
              type="submit"
              className="gradient-bg hover:opacity-90 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={isLoading || !formData.destination || !formData.startDate || !formData.endDate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                  Discovering amazing places...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Discover Destination
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
