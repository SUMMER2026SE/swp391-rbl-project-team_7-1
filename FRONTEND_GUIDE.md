# Frontend Guide

## 1. Frontend technology stack

- React: `^19.2.6`
- React Router DOM: `^7.15.1`
- Build tool: Vite `^8.0.12`
- CSS: Tailwind CSS `^3.4.19`
- Icons: `lucide-react` plus Material Symbols classes used in markup
- OAuth helper: `@react-oauth/google`
- Charts: `recharts`

## 2. Routing architecture

- Entry point: `frontend/App.jsx`
- Uses `BrowserRouter` renamed as `Router`.
- Defines a `Routes` tree with:
  - `PublicLayout` for public pages (`LandingPage`, `HelpCenter`, `ArticleVNPayEscrow`)
  - `DashboardLayout` for authenticated dashboard pages
  - Standalone routes for auth flows and payment pages
  - Wildcard redirect `*` -> `/`
- Route protection:
  - `DashboardLayout` checks localStorage token and redirects to `/login` if missing.
  - `App.jsx` conditionally renders certain routes only when `token` exists.
- Layout composition uses `Outlet` in `frontend/layouts/PublicLayout.jsx` and `frontend/layouts/DashboardLayout.jsx`.

## 3. State management

- No dedicated state library is used.
- The app relies on React built-in hooks:
  - `useState`
  - `useEffect`
  - `useRef`
- No React Context, Redux, Zustand, MobX, or similar.
- Auth/session state persists in `localStorage`:
  - `token`
  - `user`
  - `pendingVerificationEmail`
- Components frequently read `localStorage` on mount, and many use polling via `setInterval` to sync state changes across tabs/components.
- Example patterns:
  - `App.jsx` keeps a `token` state synced with `localStorage`.
  - `Header.jsx` syncs both token and user object from `localStorage`.
  - `DashboardLayout.jsx` redirects if token is missing.

## 4. API service pattern

- There is no centralized API service module.
- HTTP calls are made directly from page components using `fetch`.
- Most API URLs are hard-coded to `http://localhost:5000/api` or full auth endpoints.
- Example pages with direct API calls:
  - `frontend/pages/Login.jsx`
  - `frontend/pages/Register.jsx`
  - `frontend/pages/VerifyEmail.jsx`
  - `frontend/pages/ForgotPassword.jsx`
  - `frontend/pages/Profile.jsx`
  - `frontend/pages/Admin/Users.jsx`
- Auth headers are manually attached using `localStorage.getItem('token')`.
- There is no shared request interceptor, retry logic, or request abstraction layer.

## 5. Authentication flow in frontend

- Login and register pages store session data in `localStorage`:
  - `token`
  - `user`
- Google OAuth login is handled by `@react-oauth/google` and then forwarded to backend `/api/auth/google`.
- After successful login/register, the app navigates by role:
  - `ADMIN` -> `/admin-dashboard`
  - `EMPLOYER` -> `/employer-dashboard`
  - otherwise -> `/freelancer-dashboard`
- Email verification flow:
  - `Register` stores `pendingVerificationEmail`
  - `VerifyEmail` retrieves the email and calls `/api/auth/verify-email`
- Forgot password flow uses `/api/auth/forgot-password` and `/api/auth/reset-password`.

## 6. UI architecture and conventions

- Styling is custom Tailwind CSS in JSX class names.
- No UI component framework like Material UI, Ant Design, Chakra, or Bootstrap.
- Shared layout components:
  - `frontend/components/Header.jsx`
  - `frontend/components/Sidebar.jsx`
  - `frontend/components/Footer.jsx`
- Layout components:
  - `frontend/layouts/PublicLayout.jsx`
  - `frontend/layouts/DashboardLayout.jsx`
- Many page components are styled directly and contain large markup blocks.
- Some pages use static mock data instead of backend requests, e.g. `frontend/pages/BrowseProjects.jsx` and `frontend/pages/Projects.jsx`.

## 7. Notable frontend patterns

- Role-based navigation is derived from `user.roleDefault` stored in localStorage.
- The app uses URL query parameters for search state in `Header.jsx` and `BrowseProjects.jsx`.
- Protected routes are implemented through layout guards instead of route wrappers.
- The frontend currently mixes public page rendering with authenticated route logic in `App.jsx`.

## 8. Summary

This frontend is a Vite-powered React app using React Router for navigation, Tailwind CSS for layout, and localStorage-backed auth state. It is a mostly component-driven app with direct `fetch` calls, no global API client, and no shared state manager beyond React hooks.
