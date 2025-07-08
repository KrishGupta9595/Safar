export interface Trip {
  id: string
  user_id: string
  destination: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface WeatherData {
  current: {
    temp: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
  }
  forecast: Array<{
    date: string
    temp: number
    condition: string
    icon: string
    humidity: number
  }>
}

export interface Attraction {
  id: string
  name: string
  rating: number
  category: string
  description: string
  details: string
  image: string
}

export interface Hotel {
  id: string
  name: string
  rating: number
  price: number
  amenities: string[]
  image: string
  bookingUrl: string
}

export interface PackingList {
  essentials: string[]
  clothing: string[]
  accessories: string[]
  weatherSpecific: string[]
}
