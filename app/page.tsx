import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirection vers la page de connexion (sera gérée par le middleware)
  redirect('/login')
} 