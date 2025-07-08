import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const destination = searchParams.get("destination")

  if (!destination) {
    return NextResponse.json({ error: "Missing destination parameter" }, { status: 400 })
  }

  try {
    const apiKey = process.env.GEOAPIFY_API_KEY

    if (apiKey) {
      try {
        // Real API call to Geoapify Places
        const response = await fetch(
          `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights,entertainment,leisure&filter=place:${encodeURIComponent(destination)}&limit=20&apiKey=${apiKey}`,
        )

        if (response.ok) {
          const data = await response.json()
          const processedAttractions =
            data.features?.map((place: any, index: number) => ({
              id: place.properties.place_id || `attraction-${index}`,
              name: place.properties.name || `Attraction ${index + 1}`,
              category: place.properties.categories?.[0]?.split(".")?.[1] || "attraction",
              rating: place.properties.rating || Math.round((Math.random() * 2 + 3) * 10) / 10,
              description: place.properties.description || `Popular attraction in ${destination}`,
              details:
                place.properties.details ||
                `A must-visit destination offering unique experiences and cultural insights in ${destination}.`,
              address: place.properties.formatted || `${destination}`,
              coordinates: {
                lat: place.geometry.coordinates[1],
                lng: place.geometry.coordinates[0],
              },
              image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(place.properties.name || `Attraction ${index + 1}`)}`,
            })) || []

          if (processedAttractions.length > 0) {
            return NextResponse.json({ attractions: processedAttractions.slice(0, 8) })
          }
        }
      } catch (apiError) {
        console.error("Geoapify API error:", apiError)
      }
    }

    // Enhanced fallback mock data with more attractions
    const mockAttractions = [
      {
        id: "1",
        name: `${destination} Historic Fort`,
        category: "historical",
        rating: 4.5,
        description: "Ancient fortress with stunning architecture and panoramic city views.",
        details:
          "This magnificent fort dates back centuries and offers visitors a glimpse into the region's rich history. Explore ancient ramparts, royal chambers, and enjoy breathtaking sunset views from the highest tower. Guided tours available in multiple languages.",
        address: `${destination} Old City`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Historic Fort`)}`,
      },
      {
        id: "2",
        name: `${destination} Central Park`,
        category: "nature",
        rating: 4.8,
        description: "Large urban park perfect for walking, jogging, and family picnics.",
        details:
          "Sprawling green space in the heart of the city featuring beautiful gardens, walking trails, and recreational facilities. Home to diverse wildlife and perfect for morning jogs or evening strolls. Features a beautiful lake with boating facilities.",
        address: `${destination} Central Area`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Central Park`)}`,
      },
      {
        id: "3",
        name: `${destination} Art Museum`,
        category: "culture",
        rating: 4.3,
        description: "World-class art collection featuring local and international artists.",
        details:
          "Premier cultural institution showcasing contemporary and classical art from renowned artists. Features rotating exhibitions, interactive galleries, and educational programs. Don't miss the sculpture garden and the museum café.",
        address: `${destination} Arts District`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Art Museum`)}`,
      },
      {
        id: "4",
        name: `${destination} Grand Bazaar`,
        category: "shopping",
        rating: 4.6,
        description: "Vibrant marketplace with authentic crafts, textiles, and local delicacies.",
        details:
          "Historic marketplace bustling with activity, offering everything from handwoven textiles to aromatic spices. Perfect place to experience local culture and find unique souvenirs. Bargaining is expected and part of the fun!",
        address: `${destination} Market Square`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Grand Bazaar`)}`,
      },
      {
        id: "5",
        name: `${destination} Sacred Temple`,
        category: "religious",
        rating: 4.7,
        description: "Beautiful ancient temple with intricate carvings and peaceful atmosphere.",
        details:
          "Sacred site of worship featuring stunning architecture and spiritual significance. The temple complex includes multiple shrines, meditation areas, and beautiful gardens. Visitors are welcome but should dress modestly and respect local customs.",
        address: `${destination} Temple District`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Sacred Temple`)}`,
      },
      {
        id: "6",
        name: `${destination} Scenic Viewpoint`,
        category: "nature",
        rating: 4.9,
        description: "Breathtaking panoramic views of the city and surrounding landscape.",
        details:
          "The highest accessible point in the area offering 360-degree views of the city, mountains, and coastline. Perfect for photography, especially during sunrise and sunset. Accessible by hiking trail or cable car.",
        address: `${destination} Hills`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Scenic Viewpoint`)}`,
      },
      {
        id: "7",
        name: `${destination} Cultural Center`,
        category: "entertainment",
        rating: 4.4,
        description: "Hub for performing arts, music, and cultural events.",
        details:
          "Modern facility hosting concerts, theater performances, and cultural festivals throughout the year. Features multiple performance halls, art galleries, and workshop spaces. Check the schedule for special events during your visit.",
        address: `${destination} Entertainment District`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Cultural Center`)}`,
      },
      {
        id: "8",
        name: `${destination} Waterfront Promenade`,
        category: "nature",
        rating: 4.5,
        description: "Beautiful walkway along the water with cafes and street performers.",
        details:
          "Scenic waterfront area perfect for leisurely walks, cycling, or simply enjoying the view. Lined with cafes, restaurants, and shops. Often features street performers and local artists. Great place to watch the sunset.",
        address: `${destination} Waterfront`,
        coordinates: { lat: 0, lng: 0 },
        image: `/placeholder.svg?height=160&width=400&text=${encodeURIComponent(`${destination} Waterfront Promenade`)}`,
      },
    ]

    return NextResponse.json({ attractions: mockAttractions })
  } catch (error) {
    console.error("Attractions API error:", error)
    return NextResponse.json({ error: "Failed to fetch attractions" }, { status: 500 })
  }
}
