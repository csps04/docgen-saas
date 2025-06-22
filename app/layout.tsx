import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DocGen SaaS - Générateur de Documents',
    template: '%s | DocGen SaaS'
  },
  description: 'Générez facilement vos contrats, CGV et autres documents juridiques avec notre plateforme SaaS moderne',
  keywords: ['documents', 'contrats', 'CGV', 'devis', 'factures', 'SaaS', 'générateur'],
  authors: [{ name: 'DocGen Team' }],
  creator: 'DocGen Team',
  publisher: 'DocGen SaaS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://docgen-saas.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DocGen SaaS - Générateur de Documents',
    description: 'Générez facilement vos contrats, CGV et autres documents juridiques',
    url: 'https://docgen-saas.vercel.app',
    siteName: 'DocGen SaaS',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocGen SaaS - Générateur de Documents',
    description: 'Générez facilement vos contrats, CGV et autres documents juridiques',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
} 