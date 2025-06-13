# Vercel Deployment Troubleshooting

If the automatic deployment is still not working, try these manual configuration steps in the Vercel dashboard:

## Option 1: Configure in Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. Navigate to "General" → "Build & Development Settings"
3. Set the following:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (click "Edit" and type `frontend`)
   - **Build Command**: `npm run build` or leave default
   - **Output Directory**: `.next` or leave default
   - **Install Command**: `npm install` or leave default

4. Add Environment Variables:
   - Go to "Environment Variables"
   - Add: `NEXT_PUBLIC_API_URL` = Your backend URL

5. Redeploy:
   - Go to "Deployments"
   - Click on the three dots menu on the latest deployment
   - Select "Redeploy"

## Option 2: Delete and Re-import Project

1. Delete the current Vercel project
2. Import the repository again
3. During import:
   - Select "Next.js" as framework
   - Set Root Directory to `frontend`
   - Configure environment variables

## Option 3: Use Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod
```

## Current Configuration Files

- `vercel.json` - Contains build commands pointing to frontend
- `package.json` (root) - Redirects commands to frontend
- `.vercelignore` - Excludes backend from deployment
- `frontend/` - Contains the Next.js application

## Verification Steps

1. Check Vercel deployment logs for any errors
2. Ensure the build command is running in the frontend directory
3. Verify that `.next` directory is being created during build
4. Check that environment variables are set correctly
