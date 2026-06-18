# Folder Structure

```
ShopEZ/
├── client/                          # React frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/             # Hero, FeaturedProducts, Categories, CTA, Testimonials, Newsletter
│   │   │   ├── layout/              # Navbar, Footer, Layout
│   │   │   ├── products/            # ProductCard, ProductFilters, Pagination
│   │   │   └── ui/                  # Toast, EmptyState, Loading, ProductSkeleton
│   │   ├── context/                 # AuthContext (JWT auth state), CartContext (cart state)
│   │   ├── pages/
│   │   │   ├── admin/               # AdminLayout, Dashboard, ManageProducts, ProductForm, ManageOrders, ManageUsers
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Products.jsx         # Product catalog
│   │   │   ├── ProductDetail.jsx    # Single product view
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Orders.jsx           # Order list
│   │   │   ├── OrderDetail.jsx      # Single order view
│   │   │   ├── Profile.jsx          # User profile
│   │   │   ├── Login.jsx            # Sign in
│   │   │   └── Register.jsx         # Sign up
│   │   ├── utils/
│   │   │   ├── axios.js             # Axios instance with JWT interceptor
│   │   │   └── helpers.js           # formatPrice, truncate, getOrderStatusColor
│   │   ├── App.jsx                  # Router + providers
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind + theme variables + utilities
│   ├── .env                         # VITE_API_URL
│   ├── index.html
│   ├── package.json
│   └── vite.config.js               # Vite + React + Tailwind plugins
├── server/                          # Express backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile
│   │   ├── productController.js     # CRUD + search + filters
│   │   ├── orderController.js       # CRUD + status management
│   │   └── userController.js        # User management + analytics
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect + admin guard
│   │   └── errorHandler.js          # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema (name, email, password, role)
│   │   ├── Product.js               # Product schema (name, desc, price, category, image, stock)
│   │   └── Order.js                 # Order schema (items, address, status, pricing)
│   ├── routes/
│   │   ├── auth.js                  # /api/auth
│   │   ├── products.js              # /api/products
│   │   ├── orders.js                # /api/orders
│   │   └── users.js                 # /api/users
│   ├── utils/
│   │   └── generateToken.js         # JWT helper
│   ├── .env                         # PORT, MONGO_URL, JWT_SECRET
│   ├── seed.js                      # 50 products + test users
│   ├── server.js                    # Express app entry
│   └── package.json
├── docs/                            # Documentation
├── .gitignore
└── README.md
```
