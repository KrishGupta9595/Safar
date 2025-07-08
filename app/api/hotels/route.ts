import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const destination = searchParams.get("destination")
  const checkIn = searchParams.get("checkin")
  const checkOut = searchParams.get("checkout")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "6")
  const sortBy = searchParams.get("sortBy") || "rating"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  if (!destination || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const apiKey = process.env.TRAVELPAYOUTS_API_KEY

    if (apiKey) {
      try {
        // Try real Travelpayouts API call
        const response = await fetch(
          `https://engine.hotellook.com/api/v2/search/start?query=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=2&children=0&currency=INR&limit=${limit}&offset=${(page - 1) * limit}`,
          {
            headers: {
              "X-Access-Token": apiKey,
            },
          },
        )

        if (response.ok) {
          const data = await response.json()

          if (data.results && data.results.length > 0) {
            const processedHotels = data.results.map((hotel: any, index: number) => ({
              id: hotel.id || `hotel-${page}-${index}`,
              name: hotel.name || `Hotel ${index + 1}`,
              rating: hotel.stars || Math.round((Math.random() * 2 + 3) * 10) / 10,
              price: hotel.priceFrom || Math.floor(Math.random() * 15000) + 3000,
              amenities: hotel.amenities || ["wifi", "parking", "breakfast"],
              image: hotel.photoUrl || `/placeholder.svg?height=200&width=300`,
              bookingUrl: generateBookingUrl(hotel.name || `Hotel ${index + 1}`, destination, checkIn, checkOut),
              address: hotel.address || `${destination} City Center`,
            }))

            // Sort hotels
            const sortedHotels = sortHotels(processedHotels, sortBy, sortOrder)

            return NextResponse.json({
              hotels: sortedHotels,
              hasMore: page < 5, // Simulate pagination
              page,
              total: processedHotels.length,
            })
          }
        }
      } catch (apiError) {
        console.error("Travelpayouts API error:", apiError)
      }
    }

    // Enhanced fallback with more realistic data
    const mockHotels = generateEnhancedMockHotels(destination, checkIn, checkOut, page, limit)
    const sortedHotels = sortHotels(mockHotels, sortBy, sortOrder)

    return NextResponse.json({
      hotels: sortedHotels,
      hasMore: page < 5,
      page,
      total: mockHotels.length,
    })
  } catch (error) {
    console.error("Hotels API error:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

function generateEnhancedMockHotels(
  destination: string,
  checkIn: string,
  checkOut: string,
  page: number,
  limit: number,
) {
  const hotelTypes = [
    { prefix: "Grand", suffix: "Palace Hotel", priceRange: [8000, 15000], rating: [4.2, 4.8] },
    { prefix: "Royal", suffix: "Resort & Spa", priceRange: [12000, 25000], rating: [4.5, 5.0] },
    { prefix: "", suffix: "Heritage Hotel", priceRange: [6000, 12000], rating: [4.0, 4.5] },
    { prefix: "Luxury", suffix: "Suites", priceRange: [10000, 20000], rating: [4.3, 4.9] },
    { prefix: "Boutique", suffix: "Inn", priceRange: [5000, 10000], rating: [4.1, 4.6] },
    { prefix: "Premium", suffix: "Lodge", priceRange: [7000, 14000], rating: [4.2, 4.7] },
    { prefix: "Comfort", suffix: "Hotel", priceRange: [4000, 8000], rating: [3.8, 4.3] },
    { prefix: "Elite", suffix: "Resort", priceRange: [15000, 30000], rating: [4.6, 5.0] },
    { prefix: "Classic", suffix: "Hotel & Spa", priceRange: [9000, 18000], rating: [4.4, 4.8] },
    { prefix: "Modern", suffix: "Business Hotel", priceRange: [6500, 13000], rating: [4.0, 4.5] },
  ]

  const amenitiesList = [
    ["wifi", "parking", "breakfast", "pool"],
    ["wifi", "pool", "gym", "spa", "restaurant"],
    ["wifi", "breakfast", "restaurant", "parking"],
    ["wifi", "parking", "pool", "breakfast", "gym"],
    ["wifi", "gym", "restaurant", "bar", "spa"],
    ["wifi", "spa", "pool", "parking", "restaurant"],
    ["wifi", "breakfast", "gym", "parking"],
    ["wifi", "pool", "spa", "restaurant", "bar", "gym"],
    ["wifi", "parking", "breakfast", "gym", "pool"],
    ["wifi", "restaurant", "pool", "bar"],
  ]

  return hotelTypes.slice(0, limit).map((type, index) => {
    const hotelIndex = (page - 1) * limit + index + 1
    const hotelName = `${type.prefix} ${destination} ${type.suffix}`.trim()
    const basePrice = Math.floor(Math.random() * (type.priceRange[1] - type.priceRange[0]) + type.priceRange[0])
    const rating = Math.round((Math.random() * (type.rating[1] - type.rating[0]) + type.rating[0]) * 10) / 10

    return {
      id: `hotel-${page}-${index}`,
      name: hotelName,
      rating: rating,
      price: basePrice,
      amenities: amenitiesList[index % amenitiesList.length],
      image: `/placeholder.svg?height=200&width=300`,
      bookingUrl: generateBookingUrl(hotelName, destination, checkIn, checkOut),
      address: `${destination} ${index % 2 === 0 ? "City Center" : "Tourist District"}, ${destination}`,
    }
  })
}

function generateBookingUrl(hotelName: string, destination: string, checkIn: string, checkOut: string) {
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

function sortHotels(hotels: any[], sortBy: string, sortOrder: string) {
  return hotels.sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "price":
        comparison = a.price - b.price
        break
      case "rating":
        comparison = a.rating - b.rating
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      default:
        comparison = a.rating - b.rating
    }

    return sortOrder === "desc" ? -comparison : comparison
  })
}
