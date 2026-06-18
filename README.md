# ShopEZ - Premium E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ShopEZ is a full-stack MERN e-commerce platform built with production-quality standards. It features an Apple-inspired UI with glassmorphism, smooth animations, and a complete admin dashboard for managing products, orders, and users.

## Features

- **User Authentication** - JWT-based register/login with protected routes
- **Role Management** - Admin and customer roles with role-based access control
- **Product Catalog** - 50 seeded products across 7 categories with search, filters, and sorting
- **Shopping Cart** - Add/remove items, quantity controls, shipping calculation
- **Order Management** - Place orders, track status (Processing → Packed → Shipped → Delivered → Cancelled)
- **User Profile** - View/edit profile, recent orders history
- **Admin Dashboard** - Analytics cards (users, products, orders, revenue), CRUD operations
- **Responsive Design** - Mobile-first, works seamlessly on all devices
- **Dark Mode Ready** - CSS variables architecture for easy theme switching
- **Premium UI** - Glassmorphism, rounded cards, smooth animations, loading skeletons, empty states

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| HTTP Client | Axios |

## Screenshots

<!-- Add screenshots here -->
| Page | Preview |
|------|---------|
| Landing | ![](screenshots/landing.png) |
| Products | ![](screenshots/products.png) |
| Cart | ![](screenshots/cart.png) |
| Admin | ![](screenshots/admin.png) |

## Folder Structure

```
ShopEZ/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/        # Hero, Categories, CTA, etc.
│   │   │   ├── layout/          # Navbar, Footer, Layout
│   │   │   ├── products/        # ProductCard, Filters, Pagination
│   │   │   └── ui/              # Toast, EmptyState, Loading, Skeleton
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── pages/               # All pages
│   │   │   └── admin/           # Admin dashboard pages
│   │   ├── utils/               # Axios instance, helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Tailwind + custom styles
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                      # Express backend
│   ├── config/                  # Database config
│   ├── controllers/             # Route handlers
│   ├── data/                    # Seed data
│   ├── middleware/               # Auth, error handler
│   ├── models/                  # Mongoose schemas
│   ├── routes/                  # API routes
│   ├── utils/                   # Token generation
│   ├── .env
│   ├── package.json
│   ├── seed.js                  # Database seeder
│   └── server.js                # Entry point
├── docs/                        # Documentation
├── README.md
└── .gitignore
```

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd server
npm install
cp .env.example .env  # Update with your credentials
npm run seed          # Seed database with 50 products + test users
npm run dev           # Start development server on port 5000
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev           # Start dev server on port 5173
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run seed` | Seed database |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Products
- `GET /api/products` - List products (search, category, sort, page)
- `GET /api/products/featured` - Featured products
- `GET /api/products/categories` - List categories
- `GET /api/products/:id` - Single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/mine` - User orders (protected)
- `GET /api/orders/:id` - Single order (protected)
- `GET /api/orders` - All orders (admin)
- `PUT /api/orders/:id/status` - Update status (admin)

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/analytics` - Dashboard analytics (admin)
- `GET /api/users/:id` - Single user (admin)
- `PUT /api/users/:id` - Update user role (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### Health
- `GET /api/health` - API health check

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopez.com | admin123 |
| Customer | user@shopez.com | user123 |

## Deployment

### Backend (Render / Railway / Vercel)

1. Push to GitHub
2. Create new web service on Render/Railway
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables (MONGO_URL, JWT_SECRET, PORT)

### Frontend (Vercel / Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

## Future Scope

- Payment gateway integration (Razorpay/Stripe)
- Product reviews and ratings
- Wishlist functionality
- Email notifications
- OAuth (Google/GitHub login)
- Dark mode toggle
- Image upload with Cloudinary
- Advanced analytics with charts
- PWA support
- Multi-language support

## License

MIT License - see [LICENSE](LICENSE) file for details.
