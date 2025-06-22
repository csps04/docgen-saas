'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Document } from '@/types'

const documentTemplates = [
  {
    id: 'contrat-prestation',
    name: 'Contrat de Prestation',
    description: 'Contrat type pour la prestation de services',
    category: 'Contrats',
    icon: '📄'
  },
  {
    id: 'cgv',
    name: 'Conditions Générales de Vente',
    description: 'CGV standard pour votre activité commerciale',
    category: 'Conditions',
    icon: '📋'
  },
  {
    id: 'devis',
    name: 'Devis',
    description: 'Devis professionnel avec conditions',
    category: 'Commercial',
    icon: '💰'
  },
  {
    id: 'facture',
    name: 'Facture',
    description: 'Facture avec mentions légales',
    category: 'Commercial',
    icon: '🧾'
  }
]

// Documents de démonstration
const demoDocuments: Document[] = [
  {
    id: '1',
    user_id: 'user-1',
    template_id: '1',
    title: 'Contrat de Prestation - Client ABC',
    content: 'Contenu du document...',
    data: { client_name: 'Client ABC', price: '5000' },
    status: 'published',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    template_id: '2',
    title: 'CGV - Mon Entreprise',
    content: 'Contenu du document...',
    data: { company_name: 'Mon Entreprise' },
    status: 'draft',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-14T14:20:00Z'
  }
]

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler le chargement des documents
    setTimeout(() => {
      setDocuments(demoDocuments)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Publié'
      case 'draft':
        return 'Brouillon'
      case 'archived':
        return 'Archivé'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos documents et créez de nouveaux modèles
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Publiés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'published').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Brouillons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {documents.filter(d => d.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Modèles</p>
                  <p className="text-2xl font-bold text-gray-900">{documentTemplates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modèles disponibles */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Créer un nouveau document
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {template.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {template.description}
                  </CardDescription>
                  <Link href={`/documents/${template.id}`}>
                    <Button className="w-full">
                      Créer un document
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Documents récents */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vos documents récents
          </h2>
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Chargement des documents...</p>
                </div>
              </CardContent>
            </Card>
          ) : documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Créé le {formatDate(document.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                          {getStatusLabel(document.status)}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">📄</span>
                  <p className="text-gray-500">Aucun document créé pour le moment</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Commencez par créer votre premier document
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 