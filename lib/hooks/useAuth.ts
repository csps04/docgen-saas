'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { auth } from '@/lib/supabase/auth'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Récupérer l'utilisateur initial
    const getInitialUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        if (error) throw error

        if (authUser) {
          // Récupérer le profil utilisateur complet
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (profileError) throw profileError
          setUser(profile)
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()
            
            if (error) throw error
            setUser(profile)
          } catch (error) {
            console.error('Error getting user profile:', error)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await auth.signIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await auth.signUp(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await auth.signOut()
      if (error) throw error
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user
  }
} 