# Simu1 — Product Catalog

A MERN stack product catalog with WhatsApp ordering and admin dashboard.

## Project Structure

```
simu1/
├── backend/     → Node.js + Express API
└── frontend/    → React + Vite + Tailwind
```

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:
```
PORT=5000
MONGO_URI=mongodb+srv://...     ← Your MongoDB Atlas URI
JWT_SECRET=any_random_string
ADMIN_EMAIL=simu1@gmail.com
ADMIN_PASSWORD=your_password
```

Start the backend:
```bash
npm run dev
```

### 2. Add your logo

Place your `logo.png` file inside:
```
frontend/public/logo.png
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Customer catalog |
| `/product/:id` | Product detail |
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/products` | Product list |
| `/admin/products/new` | Add product |
| `/admin/products/edit/:id` | Edit product |

## Admin Credentials

Set in your `.env` file:
- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

The admin account is auto-created on first server start.

## WhatsApp

WhatsApp number is set to `+255613374380`.  
To change it, search for `WHATSAPP` in:
- `frontend/src/pages/customer/Catalog.jsx`
- `frontend/src/pages/customer/ProductDetail.jsx`
