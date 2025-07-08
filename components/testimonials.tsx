"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    text: "Roam List made planning my Goa trip incredibly easy! The weather forecasts were spot-on and the packing list saved me from forgetting essentials. The hotel prices in INR made budgeting so much simpler.",
    rating: 5,
    avatar: "PS",
  },
  {
    name: "Arjun Patel",
    location: "Delhi, India",
    text: "The AI recommendations were amazing! Found hidden gems in Rajasthan that I would never have discovered otherwise. The interface is beautiful and so easy to use.",
    rating: 5,
    avatar: "AP",
  },
  {
    name: "Sneha Reddy",
    location: "Bangalore, India",
    text: "Best travel planning app I've used! The hotel booking integration saved me hours of research. Love how everything is in one place with such a modern design.",
    rating: 5,
    avatar: "SR",
  },
  {
    name: "Vikram Singh",
    location: "Jaipur, India",
    text: "The weather-based packing suggestions were incredibly helpful for my Kashmir trip. The app's design is stunning and the features are exactly what modern travelers need.",
    rating: 5,
    avatar: "VS",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Loved by Travelers Everywhere</h2>
          <p className="text-xl text-gray-600">Join thousands of happy travelers who trust Roam List</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="gradient-card rounded-3xl p-12 shadow-2xl border border-white/20 backdrop-blur-sm">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                "{testimonials[currentIndex].text}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-800 text-lg">{testimonials[currentIndex].name}</p>
                  <p className="text-gray-600">{testimonials[currentIndex].location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "gradient-bg" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2 hover:gradient-bg hover:text-white hover:border-transparent transition-all duration-300 bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
