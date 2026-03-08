# EventRent

EventRent is a small event equipment rental tool with:

- A customer-facing rental request form  
- Email notifications via EmailJS  
- A lightweight Node.js/Express server  
- An admin login and a local, browser-based requests dashboard  
- Informational pages (FAQ, Returns, Privacy Policy, Accessibility, Terms & Conditions)

This repository is ready to be pushed directly to GitHub.

---

## Tech stack

- **Frontend**: React 18, Vite, React Router  
- **Server**: Node.js + Express (serves React build from `dist/` in production)  
- **Email**: EmailJS (browser SDK, `@emailjs/browser`)  
- **Storage**: `localStorage` by default; optional **Supabase** (free PostgreSQL) for a real database so requests sync across devices and browsers.

---

## Project structure

```text
eventrent/
├─ public/
│  └─ images/              # Static assets (logos, product images)
├─ src/
│  ├─ components/
│  │  ├─ Header.jsx        # Site header with CEDC logo & navigation
│  │  ├─ Footer.jsx        # 3-tier footer (brand, navigate, address bar)
│  │  ├─ Layout.jsx        # Shared layout with header, footer & page transitions
│  │  ├─ ScrollToTop.jsx   # Auto-scroll to top on route change
│  │  ├─ AdminLoginForm.jsx
│  │  └─ ProductCard.jsx
│  ├─ pages/
│  │  ├─ HomePage.jsx             # Main rental request form
│  │  ├─ AdminLoginPage.jsx       # Admin login page
│  │  ├─ AdminRequestsPage.jsx    # Admin requests dashboard
│  │  ├─ FAQPage.jsx              # Interactive FAQ with accordion
│  │  ├─ ReturnsPage.jsx          # Return policy & steps
│  │  ├─ PrivacyPolicyPage.jsx    # Privacy & data usage policy
│  │  ├─ AccessibilityPage.jsx    # WCAG accessibility statement
│  │  └─ TermsPage.jsx            # Terms & conditions
│  ├─ lib/
│  │  └─ supabase.js       # Supabase client (optional)
│  ├─ App.jsx              # Route definitions
│  ├─ main.jsx             # App entry point with ScrollToTop
│  ├─ index.css            # Global styles (page transitions, footer, etc.)
│  └─ constants.js         # EmailJS IDs, item list, storage keys
├─ index.html              # Vite entry (mounts React app)
├─ vite.config.js
├─ server.js               # Serves dist/ when built, else static fallback
├─ package.json
├─ .gitignore
└─ README.md
```

---

## Features

### Customer-Facing Pages

- **Home** (`/`) – Browse equipment, select items, fill in rental details, and submit a request.
- **FAQ** (`/faq`) – Interactive accordion with common questions and answers.
- **Returns** (`/returns`) – Step-by-step return policy and process.
- **Privacy Policy** (`/privacy-policy`) – Data collection, usage, and user rights.
- **Accessibility** (`/accessibility`) – WCAG compliance and assistive technology support.
- **Terms & Conditions** (`/terms-and-conditions`) – Full rental agreement details.

### Admin Pages

- **Admin Login** (`/admin`) – Authenticated access to the dashboard.
- **Rental Requests** (`/admin/requests`) – View, search, and manage all submitted requests.

### UX Features

- **Page Transitions** – Smooth fade-in/slide-up animation on every route change.
- **Scroll to Top** – Pages always open from the top when navigated to.
- **Responsive Footer** – 3-tier footer with CEDC branding, navigation links, address bar, and bottom policy links.

---

## Getting started (local development)

1. **Install dependencies**

   ```bash
   cd eventrent
   npm install
   ```

2. **Run the React dev server (Vite)**

   ```bash
   npm run dev
   ```

   Then open **http://localhost:5173/** (customer form).  
   - Admin login: **http://localhost:5173/admin**  
   - Admin rental requests (after login): **http://localhost:5173/admin/requests**  

3. **Production build and run**

   ```bash
   npm run build
   npm start
   ```

   Then open **http://localhost:3000/** (Express serves the built app from `dist/`).  

---

## EmailJS configuration

The rental form sends emails via EmailJS using the browser SDK.  
You must configure the following in `src/constants.js` (EMAILJS object):

- `SERVICE_ID`  
- `REQUEST_TEMPLATE_ID` (for staff notification)  
- `CONFIRM_TEMPLATE_ID` (for customer confirmation email)  
- `PUBLIC_KEY` (EmailJS public key; also used in `src/main.jsx` for `emailjs.init()`)  

These values should match your EmailJS dashboard.

---

## Admin login & requests dashboard

- **Admin page**: `/admin` (React route)  
- **Credentials** (demo only):
  - Email: `engineering@ucdenver.edu`  
  - Password: `Dean'sOffice3034`

After successful login:

- A session flag is stored (`sessionStorage`).  
- The admin is redirected to `/admin/requests`, which:
  - Reads rental submissions from the **database** (Supabase) if configured, otherwise from `localStorage`.  
  - Displays them in a table (newest first).  
  - **Refresh** re-loads from the database or localStorage.  

---

## Database (optional): Supabase (free)

To store rental requests in a **real database** (so they sync across devices and don't depend on one browser's localStorage), you can use **Supabase** (free tier: 500 MB DB, unlimited API requests).

**→ Step-by-step setup: [docs/SETUP-SUPABASE.md](docs/SETUP-SUPABASE.md)** (create project, get keys, create table, connect the app).

### Other free options (not integrated in this repo)

- **Firebase Firestore** – NoSQL, free tier, good for small apps.  
- **MongoDB Atlas** – NoSQL, free M0 cluster; you'd add Express API routes to read/write.  
- **Neon** or **PlanetScale** – Serverless PostgreSQL / MySQL; would require a small backend API.

### Supabase setup

1. **Create a free project** at [supabase.com](https://supabase.com) and get your project URL and anon (public) key from **Settings → API**.

2. **Create the table** in the Supabase SQL Editor:

   ```sql
   create table public.rental_requests (
     id bigint generated by default as identity primary key,
     created_at timestamptz default now() not null,
     order_id text unique,
     total_price text,
     items jsonb default '[]'::jsonb,
     full_name text,
     department text,
     speedtype text,
     email text,
     phone text,
     address text,
     notes text,
     start_date text,
     start_time text,
     end_date text,
     end_time text
   );

   -- Allow anonymous inserts and reads (admin view is protected by app login)
   alter table public.rental_requests enable row level security;

   create policy "Allow anonymous insert"
     on public.rental_requests for insert to anon with check (true);

   create policy "Allow anonymous select"
     on public.rental_requests for select to anon using (true);
   ```

3. **Add env vars** (copy `.env.example` to `.env` and fill in):

   ```bash
   cp .env.example .env
   ```

   In `.env`:

   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Restart the dev server (`npm run dev`). New submissions will be stored in Supabase, and the Rental Requests page will load from the database. Without these env vars, the app keeps using `localStorage` only.

---

## Scripts

Defined in `package.json`:

- `npm run dev` – Vite dev server (port 5173)  
- `npm run build` – Build for production  
- `npm start` – Express serves `dist/` on port 3000  

---

## Deployment notes

Because the app is static + EmailJS:

- Deploy the built app and `server.js` to any Node host (Render, Railway, etc.).  
- For static-only hosts (Netlify, Vercel): build with `npm run build` and set `VITE_SUPABASE_*` and EmailJS in your env so the app can use the database and send email.

---

## License

MIT – feel free to adapt this project for your own needs.
