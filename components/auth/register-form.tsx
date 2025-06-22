'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      // Simulation d'inscription pour le moment
      // TODO: Intégrer avec Supabase
      console.log('Tentative d\'inscription:', formData)
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirection vers la page de connexion avec un message de succès
      router.push('/login?message=account-created')
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de l\'inscription' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Créer un compte</CardTitle>
        <CardDescription>
          Créez votre compte pour commencer à générer des documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.general}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="votre@email.com"
            error={errors.email}
            required
          />
          
          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          
          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
          />
          
          <Button type="submit" className="w-full" loading={loading}>
            Créer un compte
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 