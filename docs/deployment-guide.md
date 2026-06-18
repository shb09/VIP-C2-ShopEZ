# Deployment Guide

## Backend Deployment (Render)

1. Push code to GitHub repository
2. Go to [render.com](https://render.com) and create a new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Name:** shopez-api
   - **Root Directory:** server
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `PORT` (set to 10000 or leave default)
6. Deploy

## Backend Deployment (Railway)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Select "Deploy from GitHub repo"
4. Set root directory to `server`
5. Add environment variables
6. Deploy

## Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import repository
3. Configure:
   - **Root Directory:** client
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
4. Add environment variable:
   - `VITE_API_URL` = your deployed backend URL + `/api`
5. Deploy

## Frontend Deployment (Netlify)

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and import repository
3. Configure:
   - **Base directory:** client
   - **Build command:** `npm run build`
   - **Publish directory:** dist
4. Add environment variable:
   - `VITE_API_URL` = your deployed backend URL + `/api`
5. Deploy

## Post-Deployment

1. Update CORS in `server/server.js` to allow your frontend domain
2. Run seed script on production database if needed
3. Verify all API endpoints are working
4. Test authentication flow
5. Check admin dashboard functionality

## Environment Variables Checklist

### Backend

- [ ] `MONGO_URL` - Production MongoDB connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `PORT` - Usually set by hosting platform

### Frontend

- [ ] `VITE_API_URL` - Production backend URL with `/api` suffix
