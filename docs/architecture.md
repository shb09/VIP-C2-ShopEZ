# Architecture

## System Design

ShopEZ follows a client-server architecture with a React single-page application (SPA) frontend communicating with a RESTful API backend.

```
┌─────────────┐     HTTP/JSON      ┌─────────────┐     Mongoose      ┌─────────────┐
│   React App │ ──────────────────> │ Express API │ ────────────────> │ MongoDB     │
│   (Vite)    │ <────────────────── │ (Node.js)   │ <──────────────── │ (Atlas)     │
└─────────────┘     JWT Token       └─────────────┘                   └─────────────┘
```

## Data Flow

1. User interacts with React UI
2. Axios sends HTTP requests with JWT in Authorization header
3. Express middleware authenticates and authorizes
4. Controllers process business logic
5. Mongoose ODM interacts with MongoDB
6. JSON response flows back to client
7. React state updates and re-renders UI

## Authentication Flow

```
Register/Login → JWT issued → Stored in localStorage
    ↓
Protected API calls → Authorization header → JWT verification
    ↓
Role check (admin/customer) → Process request or deny
```
