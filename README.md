# TCC Blog & Content Platform

Full-stack blog platform — Project 1 of The Coding Campus MERN Internship.

## Project Structure

```
TCC_Blog_Platform/
├── client/          # React frontend (built Week 3-4)
└── server/          # Express + MongoDB backend
    ├── config/       # DB connection
    ├── controllers/  # Route logic
    ├── middleware/   # Error handling
    ├── models/       # Mongoose schemas (User, Post)
    ├── routes/       # Express routers
    └── server.js     # Entry point
```

## Week 1 Setup

1. Install dependencies:
   ```
   cd server
   npm install
   ```

2. Create your real `.env` file (never commit this):
   ```
   cp .env.example .env
   ```
   Then fill in your actual `MONGO_URI` (from MongoDB Atlas) and a random
   `JWT_SECRET` (you won't use JWT until Week 2, but set it now).

3. Run the server:
   ```
   npm run dev
   ```
   You should see `Server running on port 5000` and `MongoDB connected: ...`

4. Test in Postman: import `postman/TCC_Blog_Platform.postman_collection.json`
   and run through Create → Get All → Get By ID → Update → Delete for both
   Users and Posts. Save the collection (with your test run) back into the
   repo before submitting.

## API Endpoints (Week 1)

| Method | Endpoint          | Description        |
|--------|-------------------|---------------------|
| POST   | /api/users        | Create user         |
| GET    | /api/users        | Get all users        |
| GET    | /api/users/:id    | Get single user      |
| PUT    | /api/users/:id    | Update user           |
| DELETE | /api/users/:id    | Delete user            |
| POST   | /api/posts        | Create post          |
| GET    | /api/posts        | Get all posts (with author populated) |
| GET    | /api/posts/:id    | Get single post       |
| PUT    | /api/posts/:id    | Update post             |
| DELETE | /api/posts/:id    | Delete post              |

## Week 2: Authentication & Authorization

### New setup step

Install the new dependencies (run this once):
```
cd server
npm install
```

### New/changed endpoints

| Method | Endpoint            | Auth required | Description                          |
|--------|---------------------|----------------|---------------------------------------|
| POST   | /api/auth/register  | No             | Create an account, returns a token   |
| POST   | /api/auth/login     | No             | Log in, returns a token              |
| POST   | /api/posts          | Yes            | Create a post (author = logged-in user) |
| PUT    | /api/posts/:id      | Yes (author only) | Edit a post                       |
| DELETE | /api/posts/:id      | Yes (author only) | Delete a post                     |

`GET` endpoints for both users and posts remain public, same as Week 1.

### How auth works here

- Passwords are hashed with bcrypt automatically before saving (see the
  `pre("save")` hook in `models/User.js`) — never stored as plain text.
- `/api/auth/register` and `/api/auth/login` both return a JWT `token` in
  the response.
- To call a protected route, add a header:
  `Authorization: Bearer <token>`
- `middleware/authMiddleware.js` (`protect`) checks that token and attaches
  the logged-in user to `req.user`.
- `middleware/authorizationMiddleware.js` (`isPostAuthor`) then checks that
  `req.user` is actually the author of the post being edited/deleted.
- `express-rate-limit` caps register/login attempts at 20 per 15 minutes
  per IP, to slow down brute-force guessing.
- `helmet` sets a batch of security-related HTTP headers on every response.

### Testing in Postman

Use `postman/TCC_Blog_Platform_Week2.postman_collection.json`:

1. Run **Auth → Register** (or Login if the user already exists). Copy the
   `token` from the response into the collection's `token` variable.
2. Run **Posts → Create Post (requires login)** — it uses that token
   automatically.
3. Try **Posts → Update Post (author only)** / **Delete** with a *different*
   user's token to confirm you get a 403 Forbidden — that's the
   authorization check working correctly.

## Git Workflow

```
git init
git add .
git commit -m "Week 1: project setup, REST API, models, error handling"
git branch feature/week1-api-foundations
git checkout feature/week1-api-foundations
# push and open a PR into main on GitHub
```
