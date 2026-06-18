# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require: `Authorization: Bearer <token>`

---

### POST /auth/register
Register a new user.

**Body:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123" }
```
**Response (201):**
```json
{ "_id": "...", "name": "John", "email": "john@example.com", "role": "customer", "token": "..." }
```

### POST /auth/login
Login with credentials.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Response (200):**
```json
{ "_id": "...", "name": "John", "email": "john@example.com", "role": "customer", "token": "..." }
```

### GET /auth/me (Protected)
Get current user profile.

### PUT /auth/profile (Protected)
Update profile. All fields optional.

**Body:**
```json
{ "name": "New Name", "email": "new@email.com", "password": "newpassword" }
```

---

## Products

### GET /products
List products with pagination, search, category filter, and sorting.

**Query Params:** `page` (1), `limit` (12), `search`, `category`, `sort` (newest|price_asc|price_desc)

**Response:**
```json
{ "products": [...], "page": 1, "pages": 5, "total": 50 }
```

### GET /products/featured
Get latest 8 products.

### GET /products/categories
Get all distinct categories.

**Response:** `["Mobiles", "Laptops", ...]`

### GET /products/:id
Get single product by ID.

### POST /products (Admin)
Create product.

**Body:**
```json
{ "name": "...", "description": "...", "price": 999, "category": "Mobiles", "image": "url", "stock": 10 }
```

### PUT /products/:id (Admin)
Update product.

### DELETE /products/:id (Admin)
Delete product.

---

## Orders

### POST /orders (Protected)
Create a new order.

**Body:**
```json
{
  "items": [{ "product": "...", "name": "...", "price": 999, "quantity": 2, "image": "..." }],
  "shippingAddress": { "address": "...", "city": "...", "postalCode": "..." },
  "paymentMethod": "COD"
}
```

### GET /orders/mine (Protected)
Get logged-in user's orders.

### GET /orders/:id (Protected)
Get single order. User can see own orders; admin can see all.

### GET /orders (Admin)
Get all orders with pagination and status filter.

**Query Params:** `page`, `limit`, `status`

### PUT /orders/:id/status (Admin)
Update order status.

**Body:** `{ "status": "Shipped" }`

---

## Users

### GET /users (Admin)
List all users with pagination and search.

**Query Params:** `page`, `limit`, `search`

### GET /users/analytics (Admin)
Get dashboard analytics.

**Response:**
```json
{
  "totalUsers": 10,
  "totalProducts": 50,
  "totalOrders": 25,
  "totalRevenue": 125000,
  "ordersByStatus": [{ "_id": "Processing", "count": 5 }, ...],
  "recentOrders": [...]
}
```

### GET /users/:id (Admin)
Get single user.

### PUT /users/:id (Admin)
Update user role.

**Body:** `{ "role": "admin" }`

### DELETE /users/:id (Admin)
Delete user.

---

## Health

### GET /health
**Response:** `{ "status": "ok", "message": "ShopEZ API is running" }`
