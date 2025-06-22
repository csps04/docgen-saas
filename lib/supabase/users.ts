import { supabase } from './client'
import type { User } from '@/types'

export const users = {
  // Récupérer le profil de l'utilisateur actuel
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) throw profileError
    return data
  },

  // Mettre à jour le profil utilisateur
  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Récupérer un utilisateur par ID (pour les admins)
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer le compte utilisateur
  async deleteAccount(): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('User not authenticated')

    // Supprimer le profil utilisateur (cascade avec auth.users)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)
    
    if (error) throw error
  }
} 