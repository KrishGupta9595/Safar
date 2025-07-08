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
      // Return fallback itinerary instead of error
      return generateFallbackItinerary(destination, startDate, endDate)
    }

    try {
      // Use fetch instead of GoogleGenerativeAI library for better compatibility
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
                    text: createItineraryPrompt(destination, startDate, endDate),
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

function createItineraryPrompt(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  return `Create a detailed ${days}-day travel itinerary for ${destination} from ${startDate} to ${endDate}. 

For each day, provide:
1. 3-4 top attractions to visit
2. 2-3 recommended restaurants/cafes
3. Suggested start and end times (realistic timing)
4. A brief description of the day's theme/focus

Format the response as a JSON object with this structure:
{
  "itinerary": [
    {
      "day": 1,
      "date": "${startDate}",
      "attractions": ["attraction1", "attraction2", "attraction3"],
      "restaurants": ["restaurant1", "restaurant2"],
      "startTime": "9:00 AM",
      "endTime": "8:00 PM",
      "description": "Brief description of the day's activities and theme"
    }
  ]
}

Make sure to include local attractions, authentic restaurants, and realistic timing. Focus on the most popular and highly-rated places in ${destination}.`
}

function generateFallbackItinerary(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  const itineraryData = {
    itinerary: Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      date: new Date(start.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      attractions: [
        `Historic ${destination} Center`,
        `${destination} Cultural Museum`,
        `Local Traditional Market`,
        `Scenic ${destination} Viewpoint`,
      ].slice(0, 3),
      restaurants: [
        `Traditional ${destination} Restaurant`,
        `Popular Local Cafe & Bistro`,
        `Authentic Street Food Market`,
      ].slice(0, 2),
      startTime: "9:00 AM",
      endTime: "7:00 PM",
      description: `Explore the best of ${destination} with a perfect mix of cultural attractions, local cuisine, and authentic experiences. Day ${index + 1} focuses on ${index === 0 ? "getting oriented and seeing the main highlights" : index === days - 1 ? "final exploration and souvenir shopping" : "deeper cultural immersion"}.`,
    })),
  }

  return NextResponse.json(itineraryData)
}
