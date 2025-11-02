# 🚀 Deployment Guide

This guide covers deploying the Job Portal application to **Vercel (Frontend)** and **Render (Backend)**.

---

## 📋 Prerequisites

- GitHub repository: `https://github.com/SriTanyaG/Job_Portal_Backend.git`
- Supabase database configured
- Vercel account (free tier works)
- Render account (free tier works)

---

## 🎨 Part 1: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `SriTanyaG/Job_Portal_Backend`
4. **Root Directory**: Set to `frontend`
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Install Command**: `npm install`

### Step 2: Configure Environment Variables

In Vercel project settings, add:

```
VITE_API_URL=https://your-render-app.onrender.com/api
```

Replace `your-render-app` with your actual Render backend URL (you'll get this after deploying backend).

### Step 3: Deploy

Click **"Deploy"** and wait for deployment to complete.

### Step 4: Get Frontend URL

After deployment, note your Vercel URL (e.g., `https://job-portal-frontend.vercel.app`)

---

## 🔧 Part 2: Deploy Backend to Render

### Step 1: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `SriTanyaG/Job_Portal_Backend`
4. Configure:
   - **Name**: `job-portal-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to you
   - **Branch**: `master`
   - **Root Directory**: Leave empty (root)
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application`

### Step 2: Configure Environment Variables

In Render dashboard, go to **Environment** tab and add:

#### Required Variables:

```bash
DEBUG=False
SECRET_KEY=your-secret-key-here-generate-a-random-one
ALLOWED_HOSTS=job-portal-backend-rbo1.onrender.com,job-portal-backend-three-pi.vercel.app
CORS_ALLOWED_ORIGINS=https://job-portal-backend-three-pi.vercel.app
CORS_ALLOW_ALL_ORIGINS=False
```

**⚠️ CRITICAL - Correct Format**:

**ALLOWED_HOSTS** format (NO protocol, NO trailing slash):
- ✅ Correct: `job-portal-backend-rbo1.onrender.com,job-portal-backend-three-pi.vercel.app`
- ❌ Wrong: `https://job-portal-backend-rbo1.onrender.com,https://job-portal-backend-three-pi.vercel.app`

**CORS_ALLOWED_ORIGINS** format (WITH protocol, NO trailing slash, NO path):
- ✅ Correct: `https://job-portal-backend-three-pi.vercel.app`
- ❌ Wrong: `https://job-portal-backend-three-pi.vercel.app/`
- ❌ Wrong: `job-portal-backend-three-pi.vercel.app` (missing https://)

**Note**: The code automatically cleans up ALLOWED_HOSTS (removes protocols and paths), so you can include them, but it's cleaner to use the correct format.

# Supabase Database Configuration
USE_SUPABASE_DB=True
SUPABASE_USER=postgres
SUPABASE_HOST=db.your-project-id.supabase.co
SUPABASE_PORT=5432
SUPABASE_USE_SSL=True
SUPABASE_DB=postgres
SUPABASE_PASSWORD=your-supabase-password
```

**Important Notes:**
- Replace `your-render-app` with your actual Render URL
- Replace `your-frontend.vercel.app` with your actual Vercel URL
- Generate a strong `SECRET_KEY` (you can use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)

### Step 3: Deploy

Click **"Create Web Service"** and wait for deployment.

### Step 4: Get Backend URL

After deployment, note your Render URL (e.g., `https://job-portal-backend.onrender.com`)

### Step 5: Update Frontend API URL

Go back to Vercel and update the `VITE_API_URL` environment variable to your Render backend URL.

---

## ✅ Final Steps

1. **Update Frontend API URL in Vercel**:
   - Use your Render backend URL (e.g., `https://job-portal-backend.onrender.com/api`)

2. **Redeploy Frontend** (to pick up the new API URL)

3. **Test the deployment**:
   - Visit your Vercel frontend URL
   - Try registering a user
   - Try creating a job
   - Try applying for a job

---

## 🔍 Troubleshooting

### Backend Issues:

- **Database connection failed**: Check Supabase credentials in Render environment variables
- **CORS errors**: Ensure `CORS_ALLOWED_ORIGINS` includes your Vercel URL (with `https://`)
- **500 errors**: Check Render logs for detailed error messages

### Frontend Issues:

- **API connection failed**: Verify `VITE_API_URL` in Vercel matches your Render backend URL
- **Build fails**: Check Vercel build logs for dependency issues

---

## 📝 Notes

- Render free tier spins down after 15 minutes of inactivity (first request may be slow)
- Both services auto-deploy on git push to master branch
- Environment variables are set per service and won't be committed to git

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **Supabase Dashboard**: https://app.supabase.com/

