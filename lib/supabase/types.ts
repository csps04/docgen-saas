export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      documents: {
        Row: {
          id: string
          user_id: string
          template_id: string | null
          title: string
          content: string
          data: Json
          status: 'draft' | 'published' | 'archived'
          file_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id?: string | null
          title: string
          content: string
          data: Json
          status?: 'draft' | 'published' | 'archived'
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string | null
          title?: string
          content?: string
          data?: Json
          status?: 'draft' | 'published' | 'archived'
          file_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          type: 'contrat-prestation' | 'cgv' | 'devis' | 'facture' | 'autre'
          fields: Json
          template: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          type: 'contrat-prestation' | 'cgv' | 'devis' | 'facture' | 'autre'
          fields: Json
          template: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          type?: 'contrat-prestation' | 'cgv' | 'devis' | 'facture' | 'autre'
          fields?: Json
          template?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      document_status: 'draft' | 'published' | 'archived'
      document_type: 'contrat-prestation' | 'cgv' | 'devis' | 'facture' | 'autre'
    }
  }
} 