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

## Notes for Week 2 (don't do yet, just context)

- `User.password` is currently stored as plain text — Week 2 adds bcrypt
  hashing before save, plus JWT-based login/register endpoints.
- Authorization ("only the author can edit/delete their post") also lands
  in Week 2, once JWT auth exists to identify the requester.

## Git Workflow

```
git init
git add .
git commit -m "Week 1: project setup, REST API, models, error handling"
git branch feature/week1-api-foundations
git checkout feature/week1-api-foundations
# push and open a PR into main on GitHub
```
