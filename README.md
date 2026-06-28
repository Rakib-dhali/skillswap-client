# SkillSwap — Client Application

> A modern freelance marketplace built with **Next.js 16**, **Better Auth**, and **Stripe**. SkillSwap connects clients with skilled freelancers through a streamlined task-based workflow — from posting and bidding to payment and delivery.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-000)](https://www.better-auth.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe)](https://stripe.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

---

## 🌐 Live Demo

| Application | URL |
|---|---|
| **Client (Frontend)** | [skillswap-client-a10.vercel.app](https://skillswap-client-a10.vercel.app/) |
| **Server (API)** | [skillswap-server-a10.vercel.app](https://skillswap-server-a10.vercel.app/) |

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Email/Password** and **Google OAuth** sign-in via Better Auth
- **JWT-based** session management with cookie caching
- **Role-based access control** — three distinct user roles: `Client`, `Freelancer`, `Admin`
- **Server-side route protection** using Next.js 16 `proxy.js` middleware
- **Automatic role-based redirection** on login

### 👤 Client Dashboard
- **Post Tasks** — Create jobs with title, category, budget, deadline, and description
- **Manage Tasks** — View, edit, and delete posted tasks with real-time status tracking
- **Review Proposals** — Accept or reject freelancer bids with a single click
- **Spending Analytics** — Track total tasks, open/in-progress jobs, and total spend
- **Stripe Checkout** — Securely pay freelancers through integrated Stripe payment flow

### 💼 Freelancer Dashboard
- **Browse & Search Tasks** — Filter by category, budget range, and keywords with server-side pagination
- **Submit Proposals** — Bid on tasks with proposed budget, estimated days, and a cover note
- **Active Projects** — Track accepted proposals and manage in-progress work
- **Submit Deliverables** — Upload deliverable URLs directly to completed tasks
- **Earnings Tracker** — View payment history with detailed task breakdowns
- **Profile Management** — Edit name, avatar, skills, bio, and hourly rate

### 🛡️ Admin Dashboard
- **Platform Overview** — Real-time stats: total users, tasks, active projects, revenue
- **Activity Feed** — Live aggregated feed of tasks, payments, proposals, and registrations
- **Task Management** — View all tasks, update statuses, delete tasks with confirmation modal
- **User Management** — View all registered users, ban/unban accounts
- **Transaction Ledger** — Full payment history across the platform

### 🎨 UI / UX
- **Responsive Design** — Fully mobile-first layout with collapsible sidebar navigation
- **Animated Navbar** — Auto-hides on scroll with smooth transitions (Motion library)
- **Dynamic Sidebar** — Context-aware navigation that adapts to user role
- **Server Components** — Leverages Next.js 16 RSC for fast page loads and SEO
- **Custom Error & 404 Pages** — Graceful error handling throughout

---

## 🏗️ Architecture

```
skillswap-client/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/     # Better Auth API route handler
│   │   ├── api/payment/           # Stripe payment intent creation
│   │   ├── dashboard/
│   │   │   ├── admin/             # Admin: overview, tasks, users, transactions
│   │   │   ├── client/            # Client: tasks, proposals, profile, post task
│   │   │   ├── freelancer/        # Freelancer: tasks, proposals, projects, earnings, profile
│   │   │   ├── layout.js          # Shared dashboard shell with role-aware sidebar
│   │   │   └── page.js            # Server-side role-based redirect
│   │   ├── freelancers/           # Public freelancer directory
│   │   ├── tasks/                 # Public task browsing with search & filters
│   │   ├── signin/ & signup/      # Authentication pages
│   │   ├── success/               # Post-payment confirmation
│   │   ├── layout.js              # Root layout with global Navbar
│   │   ├── error.js               # Global error boundary
│   │   └── not-found.js           # Custom 404 page
│   ├── components/
│   │   ├── Navbar.js              # Animated, scroll-aware navigation bar
│   │   ├── Hero.js                # Landing page hero section
│   │   ├── Footer.js              # Site footer
│   │   ├── Statistics.js          # Platform stats showcase
│   │   ├── TopFreelancer.js       # Featured freelancer cards
│   │   ├── LatestFeatures.js      # Featured task cards
│   │   └── How.js                 # "How It Works" section
│   ├── lib/
│   │   ├── auth.js                # Better Auth server config (MongoDB adapter, JWT, OAuth)
│   │   ├── auth-client.js         # Better Auth client hooks
│   │   ├── stripe.js              # Stripe client initialization
│   │   └── imageUpload.js         # ImageBB upload utility
│   └── proxy.js                   # Next.js 16 middleware for route protection
├── next.config.mjs
├── tailwind.config / postcss.config
└── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (Turbopack) | SSR, RSC, file-based routing, middleware |
| **UI Library** | React 19 | Component-driven UI |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **Animation** | Motion (Framer Motion) | Scroll-aware navbar, page transitions |
| **Authentication** | Better Auth | Email/password, Google OAuth, JWT, admin roles |
| **Database** | MongoDB Atlas | Cloud-hosted document database |
| **Payments** | Stripe | Secure checkout & payment processing |
| **Image Hosting** | ImageBB API | User avatar & asset uploads |
| **Icons** | React Icons (Lucide) | Consistent iconography |
| **Deployment** | Vercel | Edge-optimized hosting |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **MongoDB Atlas** cluster (or local MongoDB)
- **Stripe** account (test keys)
- **Google Cloud** OAuth credentials (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/skillswap-client.git
cd skillswap-client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file with the following:

```env
BETTER_AUTH_SECRET=your_secret_key
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_MONGO_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 NPM Packages

| Package | Version | Purpose |
|---|---|---|
| `next` | ^16.2.9 | React framework with SSR and App Router |
| `react` / `react-dom` | 19.2.4 | UI rendering engine |
| `better-auth` | ^1.6.20 | Full-featured authentication library |
| `@better-auth/mongo-adapter` | ^1.6.20 | MongoDB adapter for Better Auth |
| `mongodb` | ^7.3.0 | Native MongoDB driver for server-side operations |
| `@stripe/stripe-js` | ^9.8.0 | Stripe client-side SDK |
| `stripe` | ^22.2.3 | Stripe server-side SDK |
| `motion` | ^12.42.0 | Animation library (Framer Motion successor) |
| `react-icons` | ^5.6.0 | SVG icon library |
| `tailwindcss` | ^4 | Utility-first CSS framework |

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@skillswap.com` | `Admin@123` |
| Client | `client@skillswap.com` | `Client@123` |
| Freelancer | `freelancer@skillswap.com` | `Freelancer@123` |

> ⚠️ *These are demo credentials for the live deployment. Replace with your own for local development.*

---

## 📄 License

This project is built as a portfolio project. Feel free to reference the architecture and patterns.

---

<p align="center">
  <strong>Built with precision by a full-stack developer who believes great software is invisible.</strong>
</p>
