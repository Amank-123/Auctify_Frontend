# AUCTIFY FRONTEND

## Real-Time Auction Platform Frontend

Auctify Frontend is a React 19 + Vite 7 web application for live auctions, bid synchronization, seller dashboards, chat-based room interactions, authenticated user flows, and reporting views. The UI is built for responsive, real-time auction experiences with modern React patterns and Vite-powered development.

---

## Key Features

- JWT-based authentication with protected routes and persistent sessions
- Google OAuth sign-in from the auth pages
- Real-time auction updates, live bidding, countdowns, and bid status tracking
- Seller auction creation, seller dashboard, watchlist, order flows, and admin views
- Seller-buyer chat rooms powered through Socket.IO-backed UI flows
- Responsive mobile-first layout with Framer Motion animations, toast notifications, charts, and PDF generation
- SPA routing for homepage, explore, categories, auth, auction detail, chat, and policy pages

---

## Tech Stack

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| React 19             | Frontend library                |
| Vite 7               | Build tool and dev server       |
| Tailwind CSS 4       | Styling and utility classes     |
| React Router DOM 7   | Client-side routing             |
| Axios                | API client and request handling |
| Socket.IO Client     | Real-time communication         |
| TanStack React Query | Server-state caching and sync   |
| Framer Motion        | UI animations and transitions   |
| Recharts             | Data visualization              |
| jsPDF                | PDF generation                  |

---

## Project Structure

```bash
src/
├── app/
├── assets/
├── components/
│   ├── auth/
│   ├── common/
│   └── navbar/
├── context/
├── features/
│   ├── admin/
│   ├── auction/
│   ├── auth/
│   ├── ChatAgent/
│   ├── home/
│   ├── order/
│   ├── policies/
│   ├── setting/
│   └── user/
├── hooks/
├── layouts/
├── routes/
├── shared/
│   ├── constants/
│   ├── services/
│   └── utils/
├── index.css
└── main.jsx
```

The app uses a feature-based organization, plus shared services and utility layers for API handling, sockets, notifications, and reusable UI helpers.

---

## Architecture Highlights

- Feature-first folder structure for maintainable scaling
- Shared API layer powered by Axios with interceptor-based auth handling
- Real-time communication through Socket.IO for live auction and chat updates
- React Query for server state, caching, and async data synchronization
- Vite path aliasing via `@` for clean imports
- Vercel rewrites configured in `vercel.json` for single-page app navigation

---

## Environment Variables

Create a `.env` file in the project root, or start from the checked-in example file:

```bash
cp .env.example .env
```

Then define the backend URL used by the frontend:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

The repository includes `.env.example` with an example value, and the Axios client reads `VITE_API_BASE_URL` at runtime.

---

## Installation

### Clone the repository

```bash
git clone <repository_url>
cd Auctify_Frontend
```

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Update `VITE_API_BASE_URL` to match your backend endpoint before starting the app.

### Start the development server

```bash
npm run dev
```

The default Vite dev server runs locally and supports hot reloading for frontend development.

---

## Build and Preview

### Production build

```bash
npm run build
```

### Preview production bundle

```bash
npm run preview
```

---

## Verification

Local verification completed in this workspace:

- `npm run build` ✅ passes and generates production assets in `dist/`

The build confirmation is important because the frontend relies on Vite compression, asset handling, and SPA routing.

---

## Deployment

This frontend is intended for static hosting and Vercel deployment, with SPA rewrite support configured in `vercel.json`.

---

## Future Improvements

- Push notifications for bids, watchlist changes, and auction reminders
- AI-assisted recommendations and auction insights
- Multi-language support and accessibility enhancements
- PWA capabilities and offline-friendly caching

---

## Authors

Aman Kumar & Gautam Singh

Full Stack Developers focused on building scalable real-time auction experiences with modern React, API integration, and live UI workflows.
