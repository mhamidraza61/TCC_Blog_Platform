# Client (React Frontend) — Week 3

Built with Vite + React. Talks to the Week 1/2 Express backend via Axios.

## Setup

```
cd client
npm install
cp .env.example .env
npm run dev
```

Make sure your backend server (`cd ../server && npm run dev`) is running
on port 5000 at the same time — the frontend expects it at
`http://localhost:5000/api` by default (set in `.env`).

## Structure

```
src/
├── api/axios.js             # shared Axios instance, auto-attaches JWT
├── context/AuthContext.jsx  # logged-in user state, login/register/logout
├── validation/               # Zod schemas mirroring the backend's rules
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx    # redirects to /login if not authenticated
│   ├── PostCard.jsx
│   ├── Spinner.jsx
│   └── ErrorBanner.jsx
└── pages/
    ├── Home.jsx              # post listing
    ├── PostDetail.jsx        # single post, with author-only edit/delete
    ├── PostForm.jsx          # shared create AND edit form
    ├── Login.jsx
    └── Register.jsx
```

## What's implemented (Week 3 requirements)

- Clean, reusable component structure (see above).
- Axios connects every page to the backend API, with the JWT attached
  automatically via a request interceptor — no page manually sets the
  Authorization header itself.
- Login/Register pages call the Week 2 `/api/auth/login` and
  `/api/auth/register` endpoints, store the returned token + user in
  `localStorage`, and handle loading and error states (disabled submit
  button while submitting, an error banner on failure).
- Post create/edit form uses React Hook Form + Zod
  (`validation/postSchema.js`), validated with the same rules as the
  backend's `Post` model, so obviously-invalid submissions are caught
  client-side before ever hitting the API.
- `ProtectedRoute` blocks `/posts/new` and `/posts/:id/edit` for anyone
  not logged in, redirecting to `/login`.
- `PostDetail` only shows Edit/Delete buttons when the logged-in user is
  actually the post's author — mirroring the backend's `isPostAuthor`
  authorization check, so the UI never offers an action the API would
  reject anyway.

## Not yet built (later weeks)

- Search, filtering, pagination, and image upload (Week 4).
- Global cart/role state, admin dashboard (Project 2).
