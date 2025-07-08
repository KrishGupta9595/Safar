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
      return generateFallbackPackingList(destination, startDate, endDate)
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
                    text: createPackingListPrompt(destination, startDate, endDate),
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
      let packingData
      try {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          packingData = JSON.parse(jsonMatch[0])
        } else {
          throw new Error("No valid JSON found in response")
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", parseError)
        return generateFallbackPackingList(destination, startDate, endDate)
      }

      return NextResponse.json(packingData)
    } catch (apiError) {
      console.error("Gemini API error:", apiError)
      return generateFallbackPackingList(destination, startDate, endDate)
    }
  } catch (error) {
    console.error("Packing list generation error:", error)
    return NextResponse.json({ error: "Failed to generate packing list" }, { status: 500 })
  }
}

function createPackingListPrompt(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  // Determine season/month for weather context
  const month = start.getMonth() + 1
  const season =
    month >= 3 && month <= 5
      ? "spring"
      : month >= 6 && month <= 8
        ? "summer"
        : month >= 9 && month <= 11
          ? "autumn"
          : "winter"

  return `Create a personalized packing list for a ${days}-day trip to ${destination} from ${startDate} to ${endDate} (${season} season).

Consider:
- Weather conditions in ${destination} during ${season}
- Trip duration (${days} days)
- Local activities and culture in ${destination}
- Practical travel needs

Organize items into these categories:
1. Clothing (weather-appropriate, versatile pieces)
2. Documents (travel essentials, identification)
3. Essentials (health, hygiene, electronics)
4. Weather-Specific (season and destination specific items)

Format the response as a JSON object with this exact structure:
{
  "categories": [
    {
      "name": "Clothing",
      "color": "bg-gradient-to-r from-blue-500 to-cyan-500",
      "items": [
        "Specific clothing item 1 for ${destination} weather",
        "Specific clothing item 2",
        "etc..."
      ]
    },
    {
      "name": "Documents", 
      "color": "bg-gradient-to-r from-purple-500 to-pink-500",
      "items": [
        "Document item 1",
        "Document item 2",
        "etc..."
      ]
    },
    {
      "name": "Essentials",
      "color": "bg-gradient-to-r from-green-500 to-teal-500", 
      "items": [
        "Essential item 1",
        "Essential item 2",
        "etc..."
      ]
    },
    {
      "name": "Weather-Specific",
      "color": "bg-gradient-to-r from-orange-500 to-red-500",
      "items": [
        "Weather item 1 specific to ${destination} in ${season}",
        "Weather item 2",
        "etc..."
      ]
    }
  ]
}

Make recommendations specific to ${destination}'s climate, culture, and typical activities. Include 6-10 items per category.`
}

function generateFallbackPackingList(destination: string, startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  const packingData = {
    categories: [
      {
        name: "Clothing",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        items: [
          "Comfortable walking shoes",
          "Light cotton t-shirts (3-4)",
          "Comfortable jeans/pants (2 pairs)",
          "Light jacket or cardigan",
          "Underwear and socks (enough for trip)",
          "Sleepwear",
          "One dressy outfit for nice dinners",
          "Swimwear (if applicable)",
          "Hat or cap for sun protection",
        ],
      },
      {
        name: "Documents",
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        items: [
          "Passport/ID documents",
          "Travel insurance papers",
          "Flight/train tickets (printed copies)",
          "Hotel booking confirmations",
          "Emergency contact information",
          "Copies of important documents",
          "Travel itinerary",
          "Credit cards and cash",
        ],
      },
      {
        name: "Essentials",
        color: "bg-gradient-to-r from-green-500 to-teal-500",
        items: [
          "Phone charger and power bank",
          "Universal travel adapter",
          "Medications and first aid kit",
          "Toiletries and personal hygiene items",
          "Sunglasses",
          "Reusable water bottle",
          "Camera or smartphone",
          "Hand sanitizer",
          "Travel pillow for comfort",
        ],
      },
      {
        name: "Weather-Specific",
        color: "bg-gradient-to-r from-orange-500 to-red-500",
        items: [
          "Sunscreen SPF 30+",
          "Umbrella or rain jacket",
          "Insect repellent",
          "Light scarf for air conditioning",
          "Comfortable day backpack",
          "Weather-appropriate footwear",
          "Extra layer for temperature changes",
        ],
      },
    ],
  }

  return NextResponse.json(packingData)
}
