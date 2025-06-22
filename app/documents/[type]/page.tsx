'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FormField {
  id: string
  label: string
  type: string
  placeholder: string
  required: boolean
}

interface Template {
  id: string
  name: string
  description: string
  fields: FormField[]
  template: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DocumentGeneratorPage({
  params
}: {
  params: { type: string }
}) {
  const { type: documentType } = params
  const [template, setTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Templates de démonstration
  const demoTemplates: Record<string, Template> = {
    contrat: {
      id: '1',
      name: 'Contrat de Prestation',
      description: 'Contrat type pour prestations de services',
      fields: [
        { id: 'client_nom', label: 'Nom du client', type: 'text', placeholder: 'Nom complet du client', required: true },
        { id: 'client_adresse', label: 'Adresse du client', type: 'textarea', placeholder: 'Adresse complète', required: true },
        { id: 'prestataire_nom', label: 'Nom du prestataire', type: 'text', placeholder: 'Nom de votre entreprise', required: true },
        { id: 'prestataire_adresse', label: 'Adresse du prestataire', type: 'textarea', placeholder: 'Adresse de votre entreprise', required: true },
        { id: 'service_description', label: 'Description du service', type: 'textarea', placeholder: 'Description détaillée du service', required: true },
        { id: 'montant', label: 'Montant HT', type: 'text', placeholder: 'Montant en euros', required: true },
        { id: 'date_debut', label: 'Date de début', type: 'date', placeholder: 'Date de début des prestations', required: true },
        { id: 'date_fin', label: 'Date de fin', type: 'date', placeholder: 'Date de fin des prestations', required: true }
      ],
      template: `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CONTRAT DE PRESTATION DE SERVICES</h1>
          </div>
          
          <div class="section">
            <p><strong>ENTRE :</strong></p>
            <p>{{prestataire_nom}}<br>
            {{prestataire_adresse}}</p>
            
            <p><strong>ET :</strong></p>
            <p>{{client_nom}}<br>
            {{client_adresse}}</p>
          </div>
          
          <div class="section">
            <h2>Article 1 - Objet</h2>
            <p>Le présent contrat a pour objet la réalisation des prestations suivantes :</p>
            <p>{{service_description}}</p>
          </div>
          
          <div class="section">
            <h2>Article 2 - Durée</h2>
            <p>Le présent contrat est conclu pour une durée déterminée du {{date_debut}} au {{date_fin}}.</p>
          </div>
          
          <div class="section">
            <h2>Article 3 - Prix</h2>
            <p>Le montant total des prestations s&apos;élève à {{montant}} euros HT.</p>
          </div>
          
          <div class="signature">
            <p>Fait à _________________, le _________________</p>
            <p>Signature du prestataire : _________________</p>
            <p>Signature du client : _________________</p>
          </div>
        </body>
        </html>
      `,
      is_active: true,
      created_at: '',
      updated_at: ''
    },
    cgv: {
      id: '2',
      name: 'Conditions Générales de Vente',
      description: 'CGV standard pour entreprise',
      fields: [
        { id: 'entreprise_nom', label: 'Nom de l\'entreprise', type: 'text', placeholder: 'Nom de votre entreprise', required: true },
        { id: 'entreprise_adresse', label: 'Adresse de l\'entreprise', type: 'textarea', placeholder: 'Adresse complète', required: true },
        { id: 'siret', label: 'Numéro SIRET', type: 'text', placeholder: 'Numéro SIRET', required: true },
        { id: 'email', label: 'Email de contact', type: 'email', placeholder: 'Email de contact', required: true },
        { id: 'telephone', label: 'Téléphone', type: 'tel', placeholder: 'Numéro de téléphone', required: true }
      ],
      template: `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CONDITIONS GÉNÉRALES DE VENTE</h1>
          </div>
          
          <div class="section">
            <h2>Article 1 - Informations sur l&apos;entreprise</h2>
            <p><strong>{{entreprise_nom}}</strong><br>
            {{entreprise_adresse}}<br>
            SIRET : {{siret}}<br>
            Email : {{email}}<br>
            Téléphone : {{telephone}}</p>
          </div>
          
          <div class="section">
            <h2>Article 2 - Objet</h2>
            <p>Les présentes conditions générales de vente s&apos;appliquent à toutes les prestations conclues par {{entreprise_nom}} auprès de ses clients professionnels et particuliers.</p>
          </div>
          
          <div class="section">
            <h2>Article 3 - Prix</h2>
            <p>Les prix de nos prestations sont exprimés en euros et hors taxes. La TVA applicable est de 20%.</p>
          </div>
          
          <div class="section">
            <h2>Article 4 - Modalités de paiement</h2>
            <p>Le règlement des prestations s&apos;effectue selon les modalités définies dans nos devis et factures.</p>
          </div>
        </body>
        </html>
      `,
      is_active: true,
      created_at: '',
      updated_at: ''
    }
  }

  useEffect(() => {
    // Charger le template correspondant au type
    const selectedTemplate = demoTemplates[documentType]
    if (selectedTemplate) {
      setTemplate(selectedTemplate)
      // Initialiser les données du formulaire
      const initialData: Record<string, any> = {}
      selectedTemplate.fields.forEach(field => {
        initialData[field.id] = ''
      })
      setFormData(initialData)
    }
  }, [documentType, demoTemplates])

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const generateDocument = () => {
    if (!template) return

    let content = template.template
    Object.entries(formData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(regex, value || '')
    })

    setGeneratedContent(content)
  }

  const exportToPDF = () => {
    if (!generatedContent) return

    // Créer une nouvelle fenêtre avec le contenu
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(generatedContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const saveDocument = async () => {
    if (!template || !generatedContent) return

    setLoading(true)
    try {
      // TODO: Sauvegarder dans Supabase
      console.log('Sauvegarde du document:', {
        template_id: template.id,
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        content: generatedContent,
        data: formData
      })
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Document sauvegardé avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Modèle de document non trouvé</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
          <p className="mt-2 text-gray-600">{template.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informations du document</CardTitle>
                <CardDescription>
                  Remplissez les champs ci-dessous pour générer votre document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  {template.fields.map((field: FormField) => (
                    <div key={field.id}>
                      {field.type === 'textarea' ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.required && <span className="text-red-500"> *</span>}
                          </label>
                          <textarea
                            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        </div>
                      ) : (
                        <Input
                          label={field.label}
                          type={field.type}
                          value={formData[field.id] || ''}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="button" 
                      onClick={generateDocument}
                      className="flex-1"
                    >
                      Générer l&apos;aperçu
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du document</CardTitle>
                <CardDescription>
                  Prévisualisez votre document généré
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div 
                      className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: generatedContent }}
                    />
                    <div className="flex space-x-4">
                      <Button 
                        onClick={exportToPDF}
                        variant="outline"
                        className="flex-1"
                      >
                        Exporter en PDF
                      </Button>
                      <Button 
                        onClick={saveDocument}
                        loading={loading}
                        className="flex-1"
                      >
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Remplissez le formulaire et cliquez sur &quot;Générer l&apos;aperçu&quot;</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 