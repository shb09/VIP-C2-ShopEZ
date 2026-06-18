# Database Schema

## User

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  role: String (enum: "customer" | "admin", default: "customer"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes: email (unique)
// Pre-save hook: hashes password with bcrypt (salt rounds: 12)
// Methods: comparePassword(candidate), toJSON (excludes password)
```

## Product

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  category: String (required, enum: [
    "Mobiles", "Laptops", "Electronics",
    "Fashion", "Accessories", "Home", "Sports"
  ]),
  image: String (required, URL),
  stock: Number (required, min: 0, default: 0),
  createdAt: Date,
  updatedAt: Date
}

// Indexes: name+description (text), category+price+createdAt (compound)
```

## Order

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  items: [{
    product: ObjectId (ref: Product, required),
    name: String (required),
    price: Number (required),
    quantity: Number (required, min: 1),
    image: String (required)
  }],
  shippingAddress: {
    address: String (required),
    city: String (required),
    postalCode: String (required),
    country: String (default: "India")
  },
  paymentMethod: String (default: "COD"),
  itemsPrice: Number (required),
  shippingPrice: Number (required, default: 0),
  totalPrice: Number (required),
  status: String (enum: [
    "Processing", "Packed", "Shipped",
    "Delivered", "Cancelled"
  ], default: "Processing"),
  createdAt: Date,
  updatedAt: Date
}

// Indexes: user (for user order lookup), status (for admin filtering)
// Shipping rule: free for orders above ₹500, otherwise ₹49
```
