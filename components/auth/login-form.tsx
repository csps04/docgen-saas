'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      // Simulation de connexion pour le moment
      // TODO: Intégrer avec Supabase
      console.log('Tentative de connexion:', formData)
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirection vers le dashboard
      router.push('/dashboard')
    } catch (error) {
      setErrors({ general: 'Une erreur est survenue lors de la connexion' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre compte pour accéder à vos documents
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
          
          <Button type="submit" className="w-full" loading={loading}>
            Se connecter
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Créer un compte
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 