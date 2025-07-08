"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Luggage, Loader2, Lock, Sparkles, Check } from "lucide-react"

interface PackingListCardProps {
  destination: string
  dates: { start: string; end: string }
  disabled?: boolean
  onAuthRequired?: () => void
}

export function PackingListCard({ destination, dates, disabled = false, onAuthRequired }: PackingListCardProps) {
  const [packingList, setPackingList] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const generatePackingList = async () => {
    if (disabled) {
      onAuthRequired?.()
      return
    }

    setIsLoading(true)
    try {
      // Simulate Gemini API call
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Mock packing list data
      setPackingList({
        essentials: [
          "Passport/ID documents",
          "Travel insurance papers",
          "Phone charger & power bank",
          "Medications & first aid",
          "Comfortable walking shoes",
          "Sunglasses & hat",
        ],
        clothing: [
          "Light cotton t-shirts",
          "Comfortable jeans/pants",
          "Light jacket for evenings",
          "Underwear & socks",
          "Sleepwear",
          "Swimwear (if applicable)",
        ],
        accessories: [
          "Small backpack for day trips",
          "Camera or smartphone",
          "Portable charger",
          "Travel adapter",
          "Reusable water bottle",
          "Travel pillow",
        ],
        weatherSpecific: ["Umbrella (rainy season)", "Sunscreen SPF 30+", "Insect repellent", "Light scarf"],
      })

      toast({
        title: "Packing list generated! ✨",
        description: "Your AI-powered packing list is ready based on weather and destination.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate packing list. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleItem = (item: string) => {
    const newCheckedItems = new Set(checkedItems)
    if (newCheckedItems.has(item)) {
      newCheckedItems.delete(item)
    } else {
      newCheckedItems.add(item)
    }
    setCheckedItems(newCheckedItems)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "essentials":
        return "from-red-500 to-pink-500"
      case "clothing":
        return "from-blue-500 to-cyan-500"
      case "accessories":
        return "from-green-500 to-teal-500"
      case "weatherSpecific":
        return "from-orange-500 to-yellow-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "essentials":
        return "🎯"
      case "clothing":
        return "👕"
      case "accessories":
        return "🎒"
      case "weatherSpecific":
        return "🌤️"
      default:
        return "📋"
    }
  }

  return (
    <Card className="gradient-card border border-white/20 shadow-2xl rounded-3xl overflow-hidden animate-slide-up">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 sm:space-x-3">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-base sm:text-xl">AI Packing List</span>
          {disabled && <Lock className="w-4 h-4 sm:w-5 sm:h-5 opacity-75" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {!packingList ? (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Luggage className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Smart Packing Assistant</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2">
              Generate a personalized packing list powered by AI, based on your destination's weather, culture, and trip
              duration.
            </p>
            <Button
              onClick={generatePackingList}
              disabled={isLoading}
              className={`${
                disabled ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "gradient-bg hover:opacity-90"
              } text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
                  AI is thinking...
                </>
              ) : disabled ? (
                <>
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Sign in to Generate
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  Generate Smart List
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-sm">
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">
                  {checkedItems.size} of {Object.values(packingList).flat().length} items packed
                </span>
              </div>
            </div>

            <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto space-y-4 sm:space-y-6">
              {Object.entries(packingList).map(([category, items]) => (
                <div key={category} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${getCategoryColor(category)} rounded-xl flex items-center justify-center text-white text-sm sm:text-lg`}
                    >
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 capitalize text-sm sm:text-base">
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500">{(items as string[]).length} items</p>
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {(items as string[]).map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() => toggleItem(item)}
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            checkedItems.has(item)
                              ? "bg-green-500 border-green-500"
                              : "border-gray-300 hover:border-green-400"
                          }`}
                        >
                          {checkedItems.has(item) && <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />}
                        </button>
                        <span
                          className={`flex-1 transition-all duration-200 text-sm sm:text-base ${
                            checkedItems.has(item) ? "text-gray-500 line-through" : "text-gray-700"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
