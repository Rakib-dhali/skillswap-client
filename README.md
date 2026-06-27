# SkillSwap - Client

## Purpose
This is the frontend client for SkillSwap, a robust freelance marketplace platform connecting clients with skilled freelancers. The application provides dynamic interfaces for users to browse tasks, submit proposals, post new jobs, and process payments. It includes dedicated dashboards for Clients, Freelancers, and Admins to manage their specific workflows efficiently.

## Live Website Link
- **Client Application:** [https://skillswap-client-a10.vercel.app/](https://skillswap-client-a10.vercel.app/)
*(The companion server application is deployed at: https://skillswap-server-a10.vercel.app/)*

## Key Features
- **Secure Authentication:** Integrated Email/Password and Google sign-in using Better Auth.
- **Role-Based Workflows:** Distinct UI routing and dashboards for Clients, Freelancers, and Admins.
- **Task Management:** Interactive forms for clients to post tasks and intuitive browsing/filtering for freelancers.
- **Proposal System:** Interfaces for freelancers to bid on tasks and for clients to review, accept, or reject bids.
- **Stripe Integration:** Secure frontend checkout flows for task payments.
- **Responsive Design:** Styled with Tailwind CSS for a seamless experience across desktop and mobile devices.

## NPM Packages Used
- `next` - React framework for building the user interface and handling routing.
- `react` & `react-dom` - Core libraries for UI components.
- `better-auth` & `@better-auth/mongo-adapter` - Comprehensive authentication system and MongoDB adapter.
- `@stripe/stripe-js` & `stripe` - Secure payment processing integration.
- `mongodb` - Official MongoDB driver for server-side Next.js data fetching.
- `react-icons` - Scalable SVG icons.
- `tailwindcss` - Utility-first CSS framework for styling.
