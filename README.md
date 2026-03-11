# Equip2Lead — Full-Stack Coaching Platform

Personalised AI coaching by Dr. Denis Ekobena. Built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## 🏗️ Architecture

```
equip2lead/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   ├── globals.css           # Global styles + Tailwind
│   ├── auth/                 # Sign up / Login (Supabase Auth)
│   │   ├── page.tsx          # Auth form (email + Google)
│   │   └── callback/route.ts # OAuth callback handler
│   ├── track-selection/      # Choose coaching track
│   ├── pillar-overview/      # View 5 pillars before assessment
│   ├── intake/               # Dynamic assessment engine
│   ├── results/              # Pillar scores + focus areas
│   ├── dashboard/            # User home base
│   ├── ai-coach/             # AI chat (future: Claude API)
│   ├── weekly-checkin/       # Weekly reflection flow
│   └── admin/                # Admin dashboard (future)
├── lib/
│   ├── supabase-browser.ts   # Client-side Supabase client
│   ├── supabase-server.ts    # Server-side Supabase client
│   ├── supabase-middleware.ts # Auth middleware helper
│   ├── types.ts              # TypeScript types (mirrors DB)
│   └── i18n.ts               # Bilingual EN/FR dictionary
├── middleware.ts              # Route protection
├── tailwind.config.js         # Design tokens
└── .env.local.example         # Environment variables template
```

## 🚀 Getting Started

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of your `schema.sql` file and run it
4. Go to **Settings** → **API** and copy your:
   - Project URL
   - Anon (public) key
   - Service role key

### 2. Configure Auth

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** (already enabled by default)
3. Enable **Google** (optional):
   - Create OAuth credentials in Google Cloud Console
   - Add Client ID and Secret in Supabase
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 3. Install & Run

```bash
# Clone or unzip the project
cd equip2lead

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` 🎉

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## 📊 Database Schema

**17 tables** supporting all 5 coaching tracks:

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts (extends Supabase auth) |
| `tracks` | 5 coaching tracks |
| `pillars` | 5 pillars per track (25 total) |
| `sub_domains` | ~4-5 dimensions per pillar (21 per track) |
| `questions` | Assessment questions per sub-domain |
| `journeys` | User enrollment in a track |
| `responses` | Individual assessment answers |
| `pillar_scores` | Computed scores per pillar |
| `coaching_plans` | 12-week personalised plans |
| `weekly_checkins` | Mood, goals, reflection, commitment |
| `conversations` | AI coach chat sessions |
| `messages` | Individual chat messages |
| `knowledge_documents` | Knowledge Vault for RAG |
| `partner_links` | Marriage track spouse linking |
| `notifications` | Reminders and milestones |

## 🔐 Security

- **Row Level Security (RLS)** on every table
- Users can only access their own data
- Admins have read access to all data
- Auth middleware protects routes automatically

## 🌍 Bilingual

Full EN/FR support:
- Database stores `name_en` + `name_fr` for all content
- Static UI strings in `lib/i18n.ts`
- Language toggle ready (stored in user profile)

## 🗺️ User Flow

```
Homepage → Auth → Track Selection → Pillar Overview → Intake Assessment
→ Results (pillar scores) → Dashboard → AI Coach / Weekly Check-in
```

## 📝 Next Steps

- [ ] Add questions for all 5 tracks (currently Leadership Pillar 1 is seeded)
- [ ] Wire up AI Coach with Claude/OpenAI API
- [ ] Generate 12-week coaching plans from assessment results
- [ ] Build admin dashboard with real data
- [ ] Add CinetPay/Stripe payment integration
- [ ] Enable pgvector for Knowledge Vault semantic search
