import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { destination, startDate, endDate } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("Gemini API key not configured")
      return generateFallbackItinerary(destination, startDate, endDate)
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: createDetailedItineraryPrompt(destination, startDate, endDate),
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!generatedText) {
        throw new Error("No content generated")
      }

      // Parse the JSON response from Gemini
      let itineraryData
      try {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          itineraryData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No valid JSON found in response")
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError)
        return generateFallbackItinerary(destination, startDate, endDate)
      }

      return NextResponse.json(itineraryData)
    } catch (apiError) {
      console.error("Gemini API error:", apiError)
      return generateFallbackItinerary(destination, startDate, endDate)
    }
  } catch (error) {
    console.error("Itinerary generation error:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}

function createDetailedItineraryPrompt(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  return `Create a detailed ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}.

For each day, provide:
1. Morning activity (9AM-12PM): A specific place with name, description, and duration
2. Afternoon activity (12PM-5PM): A different specific place with name, description, and duration  
3. Evening activity (5PM-9PM): Another unique specific place with name, description, and duration
4. 3-4 local tips for that day

IMPORTANT REQUIREMENTS:
- Each activity must be at a DIFFERENT, SPECIFIC location (no repeats across days)
- Include real place names, not generic descriptions
- Activities should be diverse (mix of culture, food, nature, shopping, etc.)
- Local tips should be practical and specific to ${destination}

Format the response as a JSON object with this exact structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "morning": {
        "time": "9:00 AM - 12:00 PM",
        "place": "Specific Place Name",
        "description": "Brief description of what to do there and why it's special",
        "duration": "3 hours"
      },
      "afternoon": {
        "time": "12:00 PM - 5:00 PM", 
        "place": "Different Specific Place Name",
        "description": "Brief description of afternoon activity",
        "duration": "5 hours"
      },
      "evening": {
        "time": "5:00 PM - 9:00 PM",
        "place": "Another Different Specific Place Name", 
        "description": "Brief description of evening activity",
        "duration": "4 hours"
      },
      "localTips": [
        "Practical tip 1 specific to ${destination}",
        "Practical tip 2 about local customs or food",
        "Practical tip 3 about transportation or timing",
        "Practical tip 4 about hidden gems or local secrets"
      ]
    }
  ]
}

Make sure each day has completely different places and activities. Focus on the most authentic and popular experiences in ${destination}.`
}

function generateFallbackItinerary(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  const fallbackActivities = {
    morning: [
      {
        place: `${destination} Historic Center`,
        description: "Explore the historic heart of the city with ancient architecture and cultural landmarks",
        duration: "3 hours",
      },
      {
        place: `${destination} Central Market`,
        description: "Experience local life at the bustling traditional market with fresh produce and crafts",
        duration: "2.5 hours",
      },
      {
        place: `${destination} Art Museum`,
        description: "Discover local and international art collections in the city's premier cultural institution",
        duration: "3 hours",
      },
    ],
    afternoon: [
      {
        place: `${destination} Cultural District`,
        description: "Immerse yourself in local culture with galleries, cafes, and traditional workshops",
        duration: "4 hours",
      },
      {
        place: `${destination} Riverside Walk`,
        description: "Enjoy scenic views and local street food along the picturesque waterfront",
        duration: "3.5 hours",
      },
      {
        place: `${destination} Shopping Quarter`,
        description: "Browse local boutiques, handicrafts, and sample regional specialties",
        duration: "4.5 hours",
      },
    ],
    evening: [
      {
        place: `${destination} Night Market`,
        description: "Experience the vibrant evening atmosphere with street food and local entertainment",
        duration: "3 hours",
      },
      {
        place: `${destination} Sunset Point`,
        description: "Watch the sunset from the best viewpoint in the city with panoramic views",
        duration: "2.5 hours",
      },
      {
        place: `${destination} Cultural Show Venue`,
        description: "Enjoy traditional music and dance performances showcasing local heritage",
        duration: "3.5 hours",
      },
    ],
  }

  const localTipsSets = [
    [
      "Try the local breakfast specialties at street-side vendors",
      "Carry cash as many local places don't accept cards",
      "Learn a few basic phrases in the local language",
      "Visit temples and cultural sites in the morning when it's cooler",
    ],
    [
      "Bargain respectfully at local markets - it's part of the culture",
      "Stay hydrated and carry a water bottle",
      "Use local transportation apps for easy navigation",
      "Ask locals for restaurant recommendations - they know the best spots",
    ],
    [
      "Book popular restaurants in advance, especially for dinner",
      "Dress modestly when visiting religious or cultural sites",
      "Keep copies of important documents in separate bags",
      "Try the regional specialties - each area has unique dishes",
    ],
  ]

  const itineraryData = {
    itinerary: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      date: new Date(start.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      morning: {
        time: "9:00 AM - 12:00 PM",
        ...fallbackActivities.morning[index % fallbackActivities.morning.length],
      },
      afternoon: {
        time: "12:00 PM - 5:00 PM",
        ...fallbackActivities.afternoon[index % fallbackActivities.afternoon.length],
      },
      evening: {
        time: "5:00 PM - 9:00 PM",
        ...fallbackActivities.evening[index % fallbackActivities.evening.length],
      },
      localTips: localTipsSets[index % localTipsSets.length],
    })),
  }

  return NextResponse.json(itineraryData)
}
