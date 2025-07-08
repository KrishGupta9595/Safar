import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const destination = searchParams.get("destination")
  const checkIn = searchParams.get("checkin")
  const checkOut = searchParams.get("checkout")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "6")

  if (!destination || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const apiKey = process.env.TRAVELPAYOUTS_API_KEY

    // Enhanced mock data with real booking URLs
    const generateRealBookingUrls = (hotelName: string, destination: string, checkIn: string, checkOut: string) => {
      const encodedHotel = encodeURIComponent(hotelName)
      const encodedDestination = encodeURIComponent(destination)

      const bookingUrls = [
        `https://www.booking.com/searchresults.html?ss=${encodedDestination}&checkin=${checkIn}&checkout=${checkOut}&group_adults=2&group_children=0&selected_currency=INR&aid=1610687`,
        `https://www.agoda.com/search?city=${encodedDestination}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=1&adults=2&children=0&currency=INR&cid=1844104`,
        `https://www.expedia.co.in/Hotel-Search?destination=${encodedDestination}&startDate=${checkIn}&endDate=${checkOut}&rooms=1&adults=2&currency=INR`,
        `https://www.makemytrip.com/hotels/${encodedDestination.toLowerCase().replace(/\s+/g, "-")}-hotels.html?checkin=${checkIn}&checkout=${checkOut}&rooms=1&adults=2&currency=INR`,
        `https://www.goibibo.com/hotels/${encodedDestination.toLowerCase().replace(/\s+/g, "-")}-hotels/?checkin=${checkIn}&checkout=${checkOut}&guests=2&rooms=1`,
      ]

      return bookingUrls[Math.floor(Math.random() * bookingUrls.length)]
    }

    // Generate realistic hotel data based on destination
    const generateHotelsForDestination = (dest: string) => {
      const hotelTypes = [
        { prefix: "Grand", suffix: "Palace Hotel", priceRange: [8000, 15000] },
        { prefix: "Royal", suffix: "Resort & Spa", priceRange: [12000, 25000] },
        { prefix: "", suffix: "Heritage Hotel", priceRange: [6000, 12000] },
        { prefix: "Luxury", suffix: "Suites", priceRange: [10000, 20000] },
        { prefix: "Boutique", suffix: "Inn", priceRange: [5000, 10000] },
        { prefix: "Premium", suffix: "Lodge", priceRange: [7000, 14000] },
        { prefix: "Comfort", suffix: "Hotel", priceRange: [4000, 8000] },
        { prefix: "Elite", suffix: "Resort", priceRange: [15000, 30000] },
        { prefix: "Classic", suffix: "Hotel & Spa", priceRange: [9000, 18000] },
        { prefix: "Modern", suffix: "Business Hotel", priceRange: [6500, 13000] },
      ]

      const amenitiesList = [
        ["wifi", "parking", "breakfast"],
        ["wifi", "pool", "gym", "spa"],
        ["wifi", "breakfast", "restaurant"],
        ["wifi", "parking", "pool", "breakfast"],
        ["wifi", "gym", "restaurant", "bar"],
        ["wifi", "spa", "pool", "parking"],
        ["wifi", "breakfast", "gym"],
        ["wifi", "pool", "spa", "restaurant", "bar"],
        ["wifi", "parking", "breakfast", "gym"],
        ["wifi", "restaurant", "pool"],
      ]

      return hotelTypes
        .map((type, index) => {
          const hotelIndex = (page - 1) * limit + index + 1
          const hotelName = `${type.prefix} ${dest} ${type.suffix}`.trim()
          const basePrice = Math.floor(Math.random() * (type.priceRange[1] - type.priceRange[0]) + type.priceRange[0])

          return {
            id: `hotel-${page}-${index}`,
            name: hotelName,
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 stars
            price: basePrice,
            amenities: amenitiesList[index % amenitiesList.length],
            image: `/placeholder.svg?height=200&width=300`,
            bookingUrl: generateRealBookingUrls(hotelName, dest, checkIn, checkOut),
            address: `${dest} City Center, ${dest}`,
          }
        })
        .slice(0, limit)
    }

    const mockHotels = generateHotelsForDestination(destination)

    return NextResponse.json({
      hotels: mockHotels,
      hasMore: page < 3, // Simulate 3 pages of results
      page,
    })
  } catch (error) {
    console.error("Hotels API error:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}
