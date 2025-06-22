import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Types pour la base de données (maintenant importés depuis les types générés)
export type { Database } from './types'

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  type: string
  title: string
  content: string
  data: Record<string, any>
  created_at: string
  updated_at: string
} 