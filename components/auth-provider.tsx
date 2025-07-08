"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/auth-helpers-nextjs"

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Create supabase client only once to prevent re-initialization loops
  const [supabase] = useState(() => createClientComponentClient())

  // Use ref to prevent multiple simultaneous auth checks
  const authCheckInProgress = useRef(false)

  // Memoize getUser function to prevent infinite loops
  const getUser = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress.current) {
      return
    }

    authCheckInProgress.current = true

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Only update state if user actually changed to prevent loops
      setUser((prevUser) => {
        if (prevUser?.id !== user?.id) {
          return user
        }
        return prevUser
      })
    } catch (error) {
      console.error("Error getting user:", error)
      setUser(null)
    } finally {
      setLoading(false)
      authCheckInProgress.current = false
    }
  }, [supabase.auth])

  useEffect(() => {
    // Initial auth check
    getUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only update user state if it actually changed to prevent loops
      const newUser = session?.user ?? null
      setUser((prevUser) => {
        if (prevUser?.id !== newUser?.id) {
          return newUser
        }
        return prevUser
      })

      // Only set loading to false if we're not already loaded
      setLoading((prevLoading) => {
        if (prevLoading) {
          return false
        }
        return prevLoading
      })
    })

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [getUser, supabase.auth])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
