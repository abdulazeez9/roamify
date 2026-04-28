# 🌍 Roamify — Authentic Adventures for Young Travelers

> A full-stack tour & adventure booking platform built with a modern Turborepo monorepo architecture.

🔗 **Live Demo:** [roamify-tours.netlify.app](https://roamify-tours.netlify.app)

---

## 📖 Overview

Roamify is a feature-rich travel and adventure platform that connects adventurers with tour agents, events, and curated outdoor experiences. The platform supports multiple user roles — each with their own dedicated dashboard — covering everything from adventure discovery and trip planning to affiliate management and corporate agent onboarding.

---

## 🏗️ Project Structure

This is a **Turborepo monorepo** managed with `pnpm workspaces`.

```
roamify/
├── apps/
│   ├── web/          # Next.js 16 frontend (@roamify/web)
│   └── api/          # Express.js REST API (@roamify/api)
├── packages/
│   ├── database/     # Prisma ORM + PostgreSQL client (@roamify/database)
│   ├── types/        # Shared TypeScript types (@roamify/types)
│   ├── ui/           # Shared UI component library (@roamify/ui)
│   └── eslint-config/  # Shared ESLint configuration
```

---

## ✨ Features

### 👥 Multi-Role Authentication System
- **Adventurer** — Browse and book tours, join events, request trips, write reviews
- **Independent Agent** — Manage assigned trip requests and planning calls
- **Corporate Agent** — Company-level agent with business profile and trip management
- **Affiliate** — Community-based referral and promotion dashboard
- **Admin / Super Admin** — Full platform control, adventure management, user oversight, and platform settings

### 🧭 Adventure & Tour Management
- Browse adventures by trip type (Hiking, Kayaking, Skiing, Skydiving, Safaris, etc.)
- Filter by difficulty level (Medium, Challenging, Hard)
- Adventure gallery with image & video support (Cloudinary)
- Day-by-day itinerary breakdown
- Safety scores, certifications, and safety tips
- Like and save favourite adventures

### 📅 Events
- Create and manage events (free or paid)
- Event registration with spot tracking and cancellation terms
- Signature events support

### 🗺️ Trip Planning
- Adventurers can submit custom trip requests
- Agents are assigned to requests and can schedule planning calls via calendar integration
- Callback request system for lead capture

### 🤝 Referral System
- Built-in referral code system — every user gets a unique referral code
- Track referrer/referee relationships across the platform

### 🌐 Community
- Social feed with posts, comments, likes, and shares
- Media support (images & videos) on posts

### ⚙️ Platform Settings (Admin)
- Site-wide settings (name, description, cover image, maintenance mode)
- Destination country management
- Platform gallery management
- Newsletter subscriber management
- Contract management with digital signing

---

## 🛠️ Tech Stack

### Frontend (`@roamify/web`)
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework with SSR/SSG |
| React 19 | UI library |
| Chakra UI v3 | Component & design system |
| Framer Motion | Animations |
| TanStack Query | Server state management |
| Zustand | Client state management |
| React Hook Form + Zod | Form handling & validation |
| NextAuth.js | Authentication |
| next-themes | Dark/light mode |

### Backend (`@roamify/api`)
| Technology | Purpose |
|---|---|
| Express.js 5 | REST API framework |
| Prisma ORM | Database access layer |
| PostgreSQL | Primary database |
| Cloudinary | Media storage (images & videos) |
| JWT + bcrypt | Authentication & password hashing |
| Nodemailer | Email notifications |
| Zod | Request validation |
| Helmet + CORS | Security |
| express-rate-limit | Rate limiting |
| Multer | File upload handling |

### Shared / Infra
| Technology | Purpose |
|---|---|
| Turborepo | Monorepo build orchestration |
| pnpm | Package manager |
| TypeScript | End-to-end type safety |
| Vitest | Unit & integration testing |
| Husky + lint-staged | Pre-commit hooks |
| Prettier + ESLint | Code formatting & linting |

---

## 🗄️ Database Schema Highlights

Built with **Prisma** on **PostgreSQL**, the schema covers:

- `User` — Core user model with role-based access (`ADVENTURER`, `AFFILIATE`, `INDEPENDENT_AGENT`, `COOPERATE_AGENT`, `ADMIN`, `SUPER_ADMIN`)
- `Adventure` — Tour listings with itineraries, gallery, safety data, and access control
- `Event` + `EventRegistration` — Event management with booking and attendance tracking
- `TripRequest` — Custom trip requests matched to agents
- `TripPlanningCall` — Scheduled agent-adventurer calls with calendar integration
- `CallbackRequest` — Lead capture for interested visitors
- `Post`, `Comment`, `Like`, `Share` — Community social feed
- `Review` — User reviews with featured flag
- `Contract` — Digital agreement management
- `Affiliate`, `IndependentAgent`, `CooperateAgent` — Role-specific profile extensions
- `PlatformSettings`, `DestinationCountry`, `PlatformGallery`, `NewsletterSubscriber` — Admin-controlled platform config

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- pnpm `10.28.0`
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/roamify.git
cd roamify

# Install dependencies
pnpm install
```

### Environment Variables

Create `.env` files in the relevant packages:

**`apps/api/.env`**
```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=
```

**`apps/web/.env.local`**
```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_API_URL=
```

### Database Setup

```bash
# Run migrations
pnpm --filter @roamify/database db:migrate:dev

# Generate Prisma client
pnpm --filter @roamify/database generate

# (Optional) Create super admin
pnpm --filter @roamify/database db:create-admin
```

### Running the App

```bash
# Run all apps in development mode
pnpm dev

# Run individual apps
pnpm --filter @roamify/web dev      # Frontend on http://localhost:3000
pnpm --filter @roamify/api dev      # Backend API
```

### Building for Production

```bash
pnpm build
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @roamify/web test
pnpm --filter @roamify/api test

# Run with coverage
pnpm --filter @roamify/web test:unit
```

---

## 📁 Key Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | TypeScript type checking across all packages |
| `pnpm test` | Run all tests |

---

## 👨‍💻 Author

**Abdulazeez Muritador**
- GitHub: [https://github.com/abdulazeez9](https://github.com/abdulazeez9)
- Live: [roamify-tours.netlify.app](https://roamify-tours.netlify.app)

---

## 📄 License

This project is licensed under the **ISC License**.
