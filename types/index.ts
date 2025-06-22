// Types pour la base de données Supabase
export type DocumentStatus = 'draft' | 'published' | 'archived'
export type DocumentType = 'contrat-prestation' | 'cgv' | 'devis' | 'facture' | 'autre'

// Types pour les utilisateurs
export interface User {
  id: string
  email: string
  full_name?: string
  company_name?: string
  created_at: string
  updated_at: string
}

// Types pour les modèles de documents
export interface DocumentTemplate {
  id: string
  name: string
  description?: string
  category: string
  type: DocumentType
  fields: FormField[]
  template: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Types pour les documents générés avec relations
export interface Document {
  id: string
  user_id: string
  template_id?: string
  title: string
  content: string
  data: Record<string, any>
  status: DocumentStatus
  file_url?: string
  created_at: string
  updated_at: string
  document_templates?: DocumentTemplate
}

// Types pour les champs de formulaire
export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date'
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

// Types pour l'authentification
export interface AuthUser {
  id: string
  email: string
  created_at: string
}

// Types pour les erreurs
export interface ApiError {
  message: string
  code?: string
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

// Types pour les paramètres de requête
export interface DocumentFilters {
  status?: DocumentStatus
  type?: DocumentType
  search?: string
  limit?: number
  offset?: number
}

// Types pour la création de documents
export interface CreateDocumentData {
  template_id: string
  title: string
  data: Record<string, any>
}

// Types pour la mise à jour de documents
export interface UpdateDocumentData {
  title?: string
  content?: string
  data?: Record<string, any>
  status?: DocumentStatus
  file_url?: string
}

// Types pour les statistiques
export interface DocumentStats {
  total: number
  drafts: number
  published: number
  archived: number
  by_type: Record<DocumentType, number>
} 