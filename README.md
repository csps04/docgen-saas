# DocGen SaaS - Générateur de Documents

Une application SaaS moderne pour générer des documents professionnels (contrats, CGV, devis, factures) avec Next.js 14, TypeScript et Supabase.

## 🚀 Fonctionnalités

- ✅ Authentification complète avec Supabase
- ✅ Dashboard utilisateur moderne
- ✅ Génération dynamique de documents
- ✅ Templates personnalisables
- ✅ Export PDF
- ✅ Design responsive
- ✅ Interface en français
- ✅ Base de données PostgreSQL
- ✅ Prêt pour déploiement Vercel

## 🛠️ Technologies

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Déploiement**: Vercel
- **Génération PDF**: html2pdf.js
- **Templates**: Handlebars

## 📦 Installation Locale

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd SAAS
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
   - Créer un projet sur [Supabase](https://supabase.com)
   - Exécuter les scripts SQL dans `scripts/` :
     - `setup-database.sql` (schéma de base)
     - `insert-templates.sql` (templates par défaut)

4. **Variables d'environnement**
```bash
cp env.example .env.local
```
Remplir avec vos clés Supabase :
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://owdtdvysokntxzbwjwz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZHRkdnlzb2tudHh6YmZ3anp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDc0NjQsImV4cCI6MjA2NjEyMzQ2NH0.fgHLHBD-WV9PkJ4imrZdTdZkh92yBMvNJN_nTybqXj8
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZHRkdnlzb2tudHh6YmZ3anp3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0NzQ2NCwiZXhwIjoyMDY2MTIzNDY0fQ.fjhsR6xSwHa5WNTuY53Bzc7GOCQfrTYTE916_RKF0N0
NEXTAUTH_SECRET=docgen-saas-secret-key-2024
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

5. **Lancer en développement**
```bash
npm run dev
```

## 🚀 Déploiement sur Vercel

### Option 1: Déploiement via GitHub

1. **Pousser sur GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connecter à Vercel**
   - Aller sur [Vercel](https://vercel.com)
   - Importer le projet depuis GitHub
   - Configurer les variables d'environnement :
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Déployer**
   - Vercel détecte automatiquement Next.js
   - Le déploiement se lance automatiquement

### Option 2: Déploiement via CLI

1. **Installer Vercel CLI**
```bash
npm i -g vercel
```

2. **Se connecter**
```bash
vercel login
```

3. **Déployer**
```bash
vercel
```

4. **Configurer les variables d'environnement**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## 📁 Structure du Projet

```
SAAS/
├── app/                    # Pages Next.js 14 (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── dashboard/         # Dashboard utilisateur
│   ├── documents/         # Génération de documents
│   └── layout.tsx         # Layout principal
├── components/            # Composants React
│   ├── auth/             # Formulaires d'auth
│   ├── dashboard/        # Composants dashboard
│   └── ui/               # Composants UI réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── supabase/         # Client et fonctions Supabase
│   ├── hooks/            # Hooks personnalisés
│   └── utils.ts          # Fonctions utilitaires
├── scripts/              # Scripts SQL pour Supabase
├── types/                # Types TypeScript
└── public/               # Assets statiques
```

## 🔧 Configuration Supabase

### Tables Principales

1. **users** - Profils utilisateurs
2. **templates** - Templates de documents
3. **documents** - Documents générés
4. **user_templates** - Templates personnalisés

### RLS (Row Level Security)

Toutes les tables ont des politiques RLS activées pour la sécurité.

## 🎨 Personnalisation

### Styles
- Modifier `tailwind.config.js` pour les couleurs/thème
- Éditer `app/globals.css` pour les styles globaux

### Templates
- Ajouter de nouveaux templates dans `scripts/insert-templates.sql`
- Modifier les champs dans `lib/supabase/types.ts`

## 📝 Scripts Disponibles

```bash
npm run dev          # Développement
npm run build        # Build production
npm run start        # Démarrer production
npm run lint         # Linter ESLint
npm run type-check   # Vérification TypeScript
```

## 🔒 Sécurité

- Authentification Supabase
- Row Level Security (RLS)
- Variables d'environnement sécurisées
- Middleware de protection des routes

## 🌐 URLs de Production

- **Site principal**: https://docgen-saas.vercel.app
- **Dashboard**: https://docgen-saas.vercel.app/dashboard
- **Génération**: https://docgen-saas.vercel.app/documents/[type]

## 📞 Support

Pour toute question ou problème :
1. Vérifier les logs Vercel
2. Contrôler les variables d'environnement
3. Tester en local avec `npm run dev`

## 📄 Licence

MIT License - Libre d'utilisation et modification. 