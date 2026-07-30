Deployment Guide — Diwali Faral Store

This guide helps deploy the app (frontend + backend).

Overview
- Frontend: Vite React app in `/frontend`
- Backend: Express API in `/backend` (uses MongoDB and environment variables)

Key environment variables (backend)
- MONGO_URI — MongoDB connection string
- JWT_SECRET — JWT signing secret
- EMAIL_USER — email used for sending invoices
- EMAIL_PASS — password or app-specific password
- PORT — optional (default 5000)

Frontend configuration
- The frontend uses `VITE_API_BASE_URL` at build time to target the backend. If not set, it uses `/api` (useful when backend is proxied).

Option A — Deploy frontend to Vercel, backend to Render / Railway / Docker host
1) Push repo to GitHub (recommended)

Frontend (Vercel)
- Go to Vercel and "Import Project" → choose the GitHub repo.
- For Root Directory use `/frontend`.
- Build Command: `npm run build`
- Output Directory: `dist`
- Add Environment Variables if your backend will be at a different URL:
  - `VITE_API_BASE_URL` = `https://your-backend.example.com/api`
- Deploy. Vercel will serve the static site.

Backend (Render example)
- Create a new Web Service on Render or a Node service on Railway.
- Connect to the GitHub repo and set the root directory to `/backend`.
- Build and Start commands:
  - Build: `npm install`
  - Start: `npm start` (server uses `process.env.PORT`)
- Set the environment variables (MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS) in the service settings.
- If using Render with Docker, you can use the `backend/Dockerfile` included.

Option B — Deploy both with Docker (any Docker host)
1) Build backend image and run container (example):

```bash
# from repo root
cd backend
docker build -t diwali-faral-backend .
docker run -d -p 5000:5000 \
  -e MONGO_URI="your_mongo_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e EMAIL_USER="youremail@example.com" \
  -e EMAIL_PASS="your_email_pass" \
  --name diwali-backend diwali-faral-backend
```

2) Build frontend and serve with any static host (or use nginx container):

```bash
cd frontend
npm install
npm run build
# upload `dist` folder to your static host (Vercel/Netlify/S3+CloudFront)
```

Routing / CORS
- If frontend and backend are on different origins, set `VITE_API_BASE_URL` at frontend build, and allow CORS on the backend (server.js already allows `http://localhost:5173` — update `cors` origin to your deployed frontend URL).

One-line checklist before deploy
- [ ] Ensure `backend/.env` or service env vars are configured
- [ ] Set `VITE_API_BASE_URL` for frontend build if backend is remote
- [ ] Start backend and verify `GET /` responds
- [ ] Build and verify frontend points to backend

If you want, I can:
- Add a `vercel.json` for monorepo configuration (but integrating backend as serverless may require rewriting Express handlers), or
- Create a GitHub Actions workflow to build frontend and deploy it to Vercel automatically (needs tokens), or
- Create a Render `render.yaml` to directly deploy both services if you prefer Render.

Tell me which provider you want and I will generate the exact config files and commands tailored for it.
