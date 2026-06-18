# Setup Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- MongoDB Atlas account (free tier)
- Git

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repo-url>
cd ShopEZ
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string and JWT secret:

```env
PORT=5000
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopez?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_secret
```

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Verify

1. Open `http://localhost:5173` in your browser
2. You should see the ShopEZ landing page
3. Login with demo credentials:
   - Admin: `admin@shopez.com` / `admin123`
   - User: `user@shopez.com` / `user123`

## Production Build

### Backend

```bash
cd server
npm start
```

### Frontend

```bash
cd client
npm run build    # outputs to client/dist
npm run preview  # preview production build locally
```

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| MONGO_URL | MongoDB connection string |
| JWT_SECRET | Secret key for JWT signing |

### Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |
