# Prince Singh Portfolio

This repository contains a portfolio website for Prince Singh with a static frontend and optional Node.js backend support for email contact.

## What you can deploy

- `frontend/index.html`, `frontend/styles.css`, `frontend/script.js` — static portfolio pages
- `backend/server.js` — optional backend to send contact form messages via SMTP

## Local setup

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Copy `.env.example` to `.env` and update values:
   ```bash
   copy .env.example .env
   ```

   > Important: do not commit or deploy the `.env` file. The repo already ignores `.env` via `.gitignore`.
   > Use `backend/.env.example` as the template for local setup only.

   Set `SMTP_HOST`, `SMTP_USER`, and `SMTP_PASS` to valid SMTP credentials before starting the backend.

3. Start the backend server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000`

## Deploying live

### Option 1: Static site only

If you only want the portfolio, deploy the `frontend` folder to:
- GitHub Pages
- Netlify
- Vercel (static site)

This is the fastest path to go live.

Recommended GitHub Pages workflow:
1. Create a GitHub repository and push this project.
2. Enable Pages in repository settings.
3. Set the source to `master` or `main` branch and use the `/frontend` folder.

You can also use this GitHub Action to publish automatically from the `frontend` folder after each push:
- `.github/workflows/deploy-frontend.yml`

### Option 2: Static frontend + backend

If you want the contact form to send real email, deploy the repository to a Node host such as:
- Vercel
- Railway
- Render

Provide SMTP credentials as environment variables and the contact form will send email through the backend.

## SEO and Google visibility

To improve search visibility:
- Use a meaningful page title and description
- Add a custom domain if possible
- Submit your site to Google Search Console
- Use your name and portfolio keywords consistently
- Share your portfolio on LinkedIn, GitHub, and developer communities
- Keep content updated and mobile-friendly
- Add `robots.txt` and `sitemap.xml` to help search engines index the site

## Notes

- The contact form falls back to `mailto:` if the backend is not available or if SMTP is not configured.
- For a trusted email flow, configure SMTP credentials in `backend/.env` and start the backend with `cd backend && npm start`.
- The resume download is served by the backend at `/api/resume`, so make sure `frontend/resume.pdf` exists or replace it with your own resume.
