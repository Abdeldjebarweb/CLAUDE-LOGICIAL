# 🇩🇿 AEAB - Association des Étudiants Algériens à Bordeaux

Site officiel de l'association. Next.js + Supabase + Vercel.

## 🚀 Mise en place

### 1. Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et coller le contenu de `supabase-schema.sql` → **Run**
3. Aller dans **Authentication > Users** → créer un utilisateur admin (email + mot de passe)
4. Aller dans **Storage** → créer les buckets : `images` (public), `logos` (public), `attachments` (privé)
5. Copier l'URL du projet et la clé anon depuis **Settings > API**

### 2. GitHub

1. Créer un repo sur GitHub
2. Uploader tous les fichiers de ce projet dans le repo

### 3. Vercel

1. Aller sur [vercel.com](https://vercel.com) → **New Project** → importer le repo GitHub
2. Dans **Environment Variables**, ajouter :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anon Supabase
3. Déployer !

### 4. Accès admin

- URL : `votre-site.vercel.app/auth/login`
- Utilisez l'email/mot de passe créé dans Supabase Auth

## 📁 Structure

```
app/
├── (public)/          # Pages publiques (accueil, à propos, etc.)
├── admin/             # Espace admin protégé
├── auth/login/        # Page de connexion
├── globals.css        # Styles globaux
└── layout.tsx         # Layout racine

components/
├── public/            # Navbar, Footer
└── admin/             # Composants admin

lib/
└── supabase.ts        # Client Supabase

types/
└── index.ts           # Types TypeScript
```

## 🎨 Couleurs

- **Vert** : `#006233` (couleur principale)
- **Rouge** : `#D21034` (accents, boutons d'action)
- **Blanc** : fond dominant

## 📄 Pages

### Publiques
Accueil, À propos, Mission, Événements, Actualités, Guide étudiant, Adhésion, Demande d'aide, Équipe, Faire un don, Galerie, Partenaires, Contact, Mentions légales, Confidentialité

### Admin
Tableau de bord, Articles (CRUD), Événements (CRUD), Équipe (CRUD), Partenaires (CRUD), Galerie, Adhésions, Demandes d'aide, Dons, Messages, Paramètres
