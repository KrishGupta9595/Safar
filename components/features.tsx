import { Cloud, Hotel, Camera, Luggage, Shield, Smartphone, Zap, Globe } from "lucide-react"

const features = [
  {
    icon: Cloud,
    title: "AI Weather Forecasts",
    description: "Get 7-day weather predictions with beautiful visualizations to plan your perfect trip timing.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    description: "Find and book the best hotels with real-time prices in INR and instant booking links.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Camera,
    title: "Top Attractions",
    description: "Discover must-see attractions with ratings, categories, and detailed information.",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Luggage,
    title: "Smart Packing Lists",
    description: "AI-generated packing recommendations based on destination, weather, and trip duration.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Instant Planning",
    description: "Plan your entire trip in minutes with our lightning-fast search and recommendations.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Explore destinations worldwide with localized information and currency support.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your travel data is encrypted and secure. We prioritize your privacy above everything.",
    gradient: "from-gray-600 to-gray-800",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect experience on all devices with our responsive design and smooth animations.",
    gradient: "from-pink-500 to-rose-500",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Everything You Need to Explore</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From AI-powered recommendations to seamless bookings, we've revolutionized how you plan and experience
            travel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group gradient-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:gradient-text transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
