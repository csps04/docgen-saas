import { supabase } from './client'
import type { 
  Document, 
  DocumentTemplate, 
  CreateDocumentData, 
  UpdateDocumentData, 
  DocumentFilters,
  DocumentStats,
  DocumentStatus,
  DocumentType 
} from '@/types'

export const documents = {
  // Récupérer tous les modèles de documents actifs
  async getTemplates(): Promise<DocumentTemplate[]> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  // Récupérer un modèle de document par ID
  async getTemplate(id: string): Promise<DocumentTemplate | null> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Récupérer un modèle de document par type
  async getTemplateByType(type: DocumentType): Promise<DocumentTemplate | null> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Récupérer tous les documents de l'utilisateur
  async getUserDocuments(filters?: DocumentFilters): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select(`
        *,
        document_templates (
          id,
          name,
          type,
          category
        )
      `)
      .order('created_at', { ascending: false })

    // Appliquer les filtres
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.type) {
      query = query.eq('document_templates.type', filters.type)
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query
    
    if (error) throw error
    return data || []
  },

  // Récupérer un document par ID
  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_templates (
          id,
          name,
          type,
          category,
          fields,
          template
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Créer un nouveau document
  async createDocument(documentData: CreateDocumentData): Promise<Document> {
    // Récupérer le template pour générer le contenu
    const template = await this.getTemplate(documentData.template_id)
    if (!template) {
      throw new Error('Template not found')
    }

    // Générer le contenu avec Handlebars
    const content = await this.generateContent(template.template, documentData.data)

    const { data, error } = await supabase
      .from('documents')
      .insert({
        template_id: documentData.template_id,
        title: documentData.title,
        content,
        data: documentData.data,
        status: 'draft'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour un document
  async updateDocument(id: string, updates: UpdateDocumentData): Promise<Document> {
    const updateData: any = { ...updates }
    
    // Si on met à jour les données, régénérer le contenu
    if (updates.data) {
      const document = await this.getDocument(id)
      if (document?.document_templates) {
        const content = await this.generateContent(
          document.document_templates.template, 
          updates.data
        )
        updateData.content = content
      }
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer un document
  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Changer le statut d'un document
  async updateDocumentStatus(id: string, status: DocumentStatus): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Récupérer les statistiques des documents
  async getDocumentStats(): Promise<DocumentStats> {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('status, document_templates(type)')
    
    if (error) throw error

    const stats: DocumentStats = {
      total: documents?.length || 0,
      drafts: 0,
      published: 0,
      archived: 0,
      by_type: {
        'contrat-prestation': 0,
        'cgv': 0,
        'devis': 0,
        'facture': 0,
        'autre': 0
      }
    }

    documents?.forEach(doc => {
      // Compter par statut
      switch (doc.status) {
        case 'draft':
          stats.drafts++
          break
        case 'published':
          stats.published++
          break
        case 'archived':
          stats.archived++
          break
      }

      // Compter par type - gérer le type correctement
      if (doc.document_templates && typeof doc.document_templates === 'object' && 'type' in doc.document_templates) {
        const templateType = doc.document_templates.type as DocumentType
        if (templateType && stats.by_type[templateType] !== undefined) {
          stats.by_type[templateType]++
        }
      }
    })

    return stats
  },

  // Générer le contenu d'un document avec Handlebars
  async generateContent(template: string, data: Record<string, any>): Promise<string> {
    // Import dynamique de Handlebars pour éviter les erreurs côté serveur
    const Handlebars = (await import('handlebars')).default
    
    // Ajouter des helpers personnalisés
    Handlebars.registerHelper('formatDate', function(date: string | Date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('fr-FR')
    })

    Handlebars.registerHelper('formatCurrency', function(amount: number) {
      if (!amount) return '0,00 €'
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    })

    try {
      const compiledTemplate = Handlebars.compile(template)
      return compiledTemplate({
        ...data,
        now: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error compiling template:', error)
      throw new Error('Failed to generate document content')
    }
  },

  // Rechercher des documents
  async searchDocuments(query: string): Promise<Document[]> {
    const { data, error } = await supabase
      .from('documents')
      .select(`
        *,
        document_templates (
          id,
          name,
          type,
          category
        )
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
} 