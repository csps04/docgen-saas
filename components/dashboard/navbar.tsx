'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Navbar() {
  const handleSignOut = () => {
    // TODO: Implémenter la déconnexion Supabase
    console.log('Déconnexion...')
    window.location.href = '/login'
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              DocGen SaaS
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bonjour, Utilisateur
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 