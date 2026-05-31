# CertifyPro — Certificate Management Platform

A full-stack certificate issuance and verification system for organizations.
Issue beautiful certificates, generate shareable verification links, and let anyone verify authenticity instantly.

---

## Features

- 🎨 **3 certificate templates** — Classic (dark gold), Modern (blue), Elegant (warm)
- 📜 **Issue certificates** with recipient details, skills, grades, expiry dates
- 🔗 **Shareable verification links** — anyone can verify without an account
- 📄 **PDF download** — one-click export from the verification page
- 🔵 **LinkedIn sharing** — built-in share button
- 🔍 **Public verify page** — paste link anywhere, works on any device
- 📊 **Analytics dashboard** — track usage and top courses

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. **Issue** a certificate from the dashboard → unique ID generated (e.g. `CP-ABCD1234`)
2. **Share** the link: `https://yourapp.com/verify/CP-ABCD1234`
3. Anyone clicking the link sees the verified certificate — **no login required**
4. Recipients can download PDF or share on LinkedIn

---

## Project Structure

```
src/
├── pages/
│   ├── index.tsx          # Admin dashboard (issue, manage, analytics)
│   ├── verify/
│   │   ├── index.tsx      # Manual verification entry page
│   │   └── [id].tsx       # Public certificate verification page
│   ├── _app.tsx
│   └── _document.tsx
├── components/
│   └── CertificateView.tsx   # The certificate renderer
├── lib/
│   └── store.ts           # Data layer (localStorage — swap for DB in prod)
└── styles/
    └── globals.css
```

---

## Deploy to Production

### Option 1: Vercel (recommended — free)

```bash
npm install -g vercel
vercel deploy
```

### Option 2: Any Node.js host

```bash
npm run build
npm start
```

---

## Replace localStorage with a Real Database

The current implementation uses `localStorage` (browser storage) which works for demos.
For production, replace `src/lib/store.ts` with database calls.

### Recommended: Supabase (free tier)

```bash
npm install @supabase/supabase-js
```

Create a `certificates` table in Supabase:

```sql
create table certificates (
  id text primary key,
  recipient_name text not null,
  recipient_email text,
  course_name text not null,
  description text,
  issuer_name text,
  issuer_title text,
  org_name text not null,
  issued_date date not null,
  expiry_date date,
  template text default 'classic',
  skills text[],
  grade text,
  created_at timestamptz default now()
);

-- Make it publicly readable for verification
create policy "Anyone can verify certificates"
  on certificates for select using (true);

-- Only authenticated users can issue
create policy "Authenticated users can insert"
  on certificates for insert
  with check (auth.role() = 'authenticated');
```

Then update `src/lib/store.ts` to use the Supabase client instead of localStorage.

---

## Add Email Notifications (optional)

Install Resend or SendGrid to email certificates to recipients after issuance:

```bash
npm install resend
```

Create an API route `src/pages/api/send-cert.ts` to trigger on certificate issue.

---

## Custom Domain

Once deployed on Vercel:
1. Go to Vercel Dashboard → Domains
2. Add `certs.yourorg.com`
3. Update DNS with your domain registrar

Your verification links become: `certs.yourorg.com/verify/CP-ABCD1234`

---

## Environment Variables

For production, create `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://certs.yourorg.com
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_key (optional, for emails)
```
