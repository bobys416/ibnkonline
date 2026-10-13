# 🛍️ Buymecart — Production E-Commerce Platform

Buymecart is a full-stack, enterprise-grade multi-category e-commerce and banking platform engineered specifically for the Indian market (INR ₹ currency, UPI & Card payments, pan-India pincodes, GST tax categories, and robust RBAC).

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5
- **Database & ORM**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Authentication**: JWT access tokens + httpOnly refresh token cookies with rotation
- **Security**: Rate limiting, OWASP-compliant security headers (CSP, HSTS, X-Frame-Options), CORS
- **Payments**: Stripe-hosted Checkout with server-side session and payment verification
- **Validation**: Zod schema validation
- **Testing**: Jest unit tests + Playwright E2E suite

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- PostgreSQL database (local or cloud like Neon / Supabase)
- npm or pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local` or `.env` and fill in your database credentials:
```bash
cp .env.example .env
```

Key environment variables:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/buymecart?schema=public"
NEXTAUTH_SECRET="your-32-character-secret-key"
JWT_ACCESS_TOKEN_EXPIRY="15m"
STRIPE_SECRET_KEY="sk_test_..."
```

Keep `STRIPE_SECRET_KEY` in `.env.local` or your deployment's server-side secrets manager. Do not commit the key or expose it through a `NEXT_PUBLIC_` variable. Online checkout redirects to Stripe and verifies the completed session server-side; local order history remains in the browser.

### 3. Generate Prisma Client & Migrate
```bash
# Generate Prisma Client
npm run db:generate

# Push schema directly to your database (or run migrations)
npm run db:push
```

### 4. Seed the Database
Populate system roles, permissions, administrative users, categories, brands, store settings, and featured products:
```bash
npm run db:seed
```

**Default Seed Credentials:**
| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@buymecart.com` | `Admin@123456` |
| **Product Manager** | `product@buymecart.com` | `Admin@123456` |
| **Customer** | `customer@buymecart.com` | `Customer@123456` |

### 5. Start the Dev Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🧪 Running Tests

Execute the Jest test suite covering monetary paise arithmetic, Zod schemas, JWT tokens, and RBAC:
```bash
npm test
```

---

## 🏛️ Architecture Highlights

1. **Integer Money Representation (Paise)**: All monetary values are handled and stored as integers in paise (e.g., ₹1,499.00 = `149900` paise) to prevent floating-point rounding inaccuracies.
2. **Granular RBAC**: Role-Based Access Control enforcing module-level permissions across super admin, product managers, catalog approvers, finance ops, and customers.
3. **Defense-in-depth Middleware**: Next.js edge middleware enforcing IP rate limiting, CSP, frame protections, and CORS preflight.

# ibnkonline
