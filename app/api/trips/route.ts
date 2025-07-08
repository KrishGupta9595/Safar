import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: trips, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching trips:", error)
      return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
    }

    return NextResponse.json({ trips })
  } catch (error) {
    console.error("Trips API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { destination, startDate, endDate } = await request.json()

    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        destination,
        start_date: startDate,
        end_date: endDate,
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving trip:", error)
      return NextResponse.json({ error: "Failed to save trip" }, { status: 500 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error("Save trip API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
