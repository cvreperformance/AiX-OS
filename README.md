# AiX OS — Platformă Imobiliară & Investment Intelligence

**Intelligence Layer Built for Investors.**

Site-ul principal al ecosistemului AiX OS. Next.js + Supabase + Tailwind CSS.

## Ce include

- **Homepage** — hero, indicatori piață, produse, proprietăți selectate, Market Pulse
- **Proprietăți** (`/anunturi`) — listă + detaliu cu AiX Score
- **Market Pulse** (`/stiri`) — știri analizate cu score și investment insight
- **Oportunități** (`/oportunitati`) — off-market, dezvoltări, portofolii
- **AiX Score** (`/aix-score`) — explicație sistem rating proprietar
- **AI Advisor** (`/ai`) — consilier investiții (demo chat)
- **Dezvoltatori** (`/dezvoltatori`) — developer score
- **Agenții** (`/agentii`) — ecosistem parteneri
- **Contact** + **Despre**
- **Admin Panel** (`/admin`) — dashboard + gestionare conținut

## Start rapid (0 configurare)

Site-ul funcționează imediat cu **date demo** — nu ai nevoie de Supabase pentru preview.

```bash
cd ~/Projects/aix-os
npm run dev
```

Deschide [http://localhost:3000](http://localhost:3000)

## Setup Supabase (gratuit, ~10 minute)

### Pas 1 — Cont Supabase
1. Mergi la [supabase.com](https://supabase.com) → **Start your project** (free)
2. Creează un proiect nou (alege regiune EU, ex. Frankfurt)
3. Așteaptă ~2 minute până e gata

### Pas 2 — Rulează schema
1. În Supabase Dashboard → **SQL Editor**
2. Copiază tot conținutul din `supabase/schema.sql`
3. Apasă **Run**

### Pas 3 — Conectează site-ul
1. Supabase → **Settings** → **API**
2. Copiază **Project URL** și **anon public key**
3. Creează fișier `.env.local` în root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@yourdomain.com
```

4. Restart: `npm run dev`

### Pas 4 — Cont admin
1. Supabase → **Authentication** → **Users** → **Add user**
2. Adaugă email + parolă
3. SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'emailul-tau@exemplu.com';
```

## Deploy gratuit (Vercel)

1. Push pe GitHub
2. [vercel.com](https://vercel.com) → Import project
3. Adaugă env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY, ADMIN_EMAIL)
4. Deploy — primești URL live

## Structură proiect

```
src/
  app/
    (site)/          # Pagini publice
    admin/           # Panou administrare
  components/
    layout/          # Header, Footer
    ui/              # Cards, ScoreBadge, etc.
    admin/           # Sidebar, Table
  lib/
    demo-data.ts     # Date demo (fallback)
    data.ts          # Fetch Supabase sau demo
    supabase/        # Client config
supabase/
  schema.sql         # Schema DB
```

## Tech stack

| Tool | Cost | Rol |
|------|------|-----|
| Next.js 16 | Gratuit | Framework |
| Tailwind CSS 4 | Gratuit | Design luxury dark |
| Supabase | Gratuit (500MB) | Database + Auth |
| Vercel | Gratuit | Hosting |
| Unsplash | Gratuit | Imagini demo |

## Următorii pași

- [ ] Conectare n8n → auto-publish știri în Supabase
- [ ] AI Advisor live (OpenAI / Ollama API)
- [ ] Formular contact funcțional (Supabase / Resend)
- [ ] Upload imagini (Supabase Storage)
- [ ] Domeniu custom (aixos.ro)

---

Powered by **AiX OS Market Pulse** · Information is infinite. Intelligence is rare.
