# Deployment Guide

This deploys the backend to **Render** and the frontend to **Vercel** —
both have free tiers and don't need a credit card to start.

## 1. Set up Cloudinary (needed before deploying)

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account.
2. On your dashboard, copy your **Cloud Name**, **API Key**, and
   **API Secret** — you'll need all three in step 2.

## 2. Deploy the backend to Render

1. Push your latest code to GitHub (you're already doing this every week).
2. Go to [render.com](https://render.com), sign up/log in with GitHub.
3. Click **New +** → **Web Service** → connect your `TCC_Blog_Platform`
   repository.
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Under **Environment Variables**, add every value from your
   `server/.env` file:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV` set to `production`
   - `CLIENT_URL` — leave this blank for now, you'll fill it in after
     step 3 once you know your Vercel URL
6. Click **Create Web Service**. Render will build and deploy —
   this takes a few minutes. Once live, you'll get a URL like
   `https://tcc-blog-platform.onrender.com`.
7. Test it: open `https://your-render-url.onrender.com/` in a browser —
   you should see `{"message":"TCC Blog Platform API is running"}`.

**Note:** Render's free tier "spins down" after 15 minutes of no traffic,
so the first request after a while will be slow (10-30 seconds) while it
wakes back up. This is normal for a free-tier deployment, not a bug.

## 3. Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com), sign up/log in with GitHub.
2. Click **Add New** → **Project** → import your `TCC_Blog_Platform` repo.
3. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (should auto-detect)
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
     (your actual Render URL from step 2, with `/api` on the end)
5. Click **Deploy**. Once done, you'll get a URL like
   `https://tcc-blog-platform.vercel.app`.

## 4. Connect them together (fix CORS)

Now that you have your real Vercel URL:

1. Go back to your Render service → **Environment**.
2. Set `CLIENT_URL` to your Vercel URL (e.g.
   `https://tcc-blog-platform.vercel.app`, no trailing slash).
3. Save — Render will automatically redeploy with the new value.

This matters because `server.js` only allows CORS requests from
`CLIENT_URL` in production — without this step, your deployed frontend's
requests to the API will be blocked by the browser.

## 5. Verify the full deployed app

1. Open your Vercel URL.
2. Register a new account, create a post with a cover image, confirm it
   shows up on the home page with the image, search for it, and confirm
   editing/deleting works.
3. If anything fails, check Render's **Logs** tab first — most issues are
   a missing/mistyped environment variable.

## Updating after this

Every time you push new commits to `main` (after merging a PR), both
Render and Vercel automatically redeploy — you don't need to repeat these
steps for future changes, only if you add new environment variables.
