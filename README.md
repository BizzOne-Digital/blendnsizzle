# Blend N Sizzle

Production website and admin panel for Blend N Sizzle — a healthy café opening soon in
Belleville, Ontario. Built with Next.js App Router, TypeScript, Tailwind CSS and MongoDB.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- MongoDB Atlas + Mongoose
- Route Handlers for all APIs (no separate Express server)
- JWT-based admin session (httpOnly cookie) + bcrypt password hashing
- Images stored as binary in MongoDB (`StoredUpload`) — safe for Vercel's read-only filesystem

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   MONGODB_URI=your MongoDB Atlas connection string
   JWT_SECRET=a long random string
   ADMIN_EMAIL=the first admin's email
   ADMIN_PASSWORD=the first admin's password
   ```

   The admin user is seeded automatically from `ADMIN_EMAIL`/`ADMIN_PASSWORD` on first login —
   no manual database setup required. Change the password afterwards by updating the
   `AdminUser` document (a self-service "change password" screen can be added later).

2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login`
   for the admin panel.

## Admin Panel

- `/admin/login` — sign in
- `/admin` — dashboard
- `/admin/menu` — menu item CRUD (image, price, tags, featured, availability)
- `/admin/categories` — menu category CRUD
- `/admin/pages` — homepage hero/about/coming-soon copy
- `/admin/images` — browse and delete uploaded images
- `/admin/messages` — contact form submissions
- `/admin/settings` — business info, opening status, Uber Eats/DoorDash links, socials

All `/admin` routes and mutating API routes are protected server-side via `requireAdmin()`
(`lib/auth.ts`) — not just hidden in the UI.

## Content Notes

No final menu, pricing, opening date, or ordering links have been supplied by the client yet.
The site ships with graceful placeholders ("Our full menu is coming soon", disabled Order Now
options) until an admin fills these in from `/admin/settings` and `/admin/menu`.

## Deployment (Vercel)

1. Push to a Git repository and import it into Vercel.
2. Set the environment variables from `.env.example` in the Vercel project settings.
3. Deploy. Uploaded images are stored in MongoDB, so they persist across redeployments and
   cold starts — no persistent disk is required.
