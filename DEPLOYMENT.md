# LearnBite Deployment Guide

This guide will help you deploy LearnBite with:
- **Frontend:** GitHub Pages (Free)
- **Backend:** Supabase Edge Functions (Secure API key handling)
- **Database & Auth:** Supabase

## Prerequisites

1. A Supabase account (free tier available)
2. An OpenAI API key
3. A GitHub account
4. Supabase CLI installed locally

## Step 1: Set Up Supabase Project

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name:** learnbite (or your choice)
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to your users
5. Click "Create new project"

### 1.2 Get Your Supabase Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

Keep these safe - you'll need them later.

## Step 2: Install Supabase CLI

### On macOS/Linux:
```bash
brew install supabase/tap/supabase
```

### On Windows:
```powershell
scoop install supabase
```

### Verify installation:
```bash
supabase --version
```

## Step 3: Link Your Project to Supabase

### 3.1 Login to Supabase CLI
```bash
supabase login
```

This will open a browser window. Authorize the CLI.

### 3.2 Link to Your Project

Navigate to your project directory:
```bash
cd /path/to/learnbite
```

Link to your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

**To find your project-ref:**
- Go to Supabase Dashboard → Project Settings → General
- Copy the "Reference ID"

When prompted for the database password, enter the one you created earlier.

## Step 4: Deploy Edge Functions

### 4.1 Set Up OpenAI API Key in Supabase

You need to add your OpenAI API key as a secret in Supabase:

```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

**To get an OpenAI API key:**
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy it immediately (you won't see it again)

### 4.2 Deploy the Edge Functions

Deploy both functions:

```bash
supabase functions deploy generate-quiz
supabase functions deploy generate-lesson
```

You should see success messages like:
```
Deployed Function generate-quiz on project xxxxx
Deployed Function generate-lesson on project xxxxx
```

### 4.3 Verify Edge Functions

Test that the functions are deployed:

```bash
supabase functions list
```

You should see:
- generate-quiz
- generate-lesson

## Step 5: Configure GitHub Repository

### 5.1 Add Repository Secrets

Go to your GitHub repository:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

| Secret Name | Value |
|------------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

**Important:** Do NOT add your OpenAI API key here - it's already in Supabase secrets!

### 5.2 Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select:
   - Source: **GitHub Actions**
3. Save

## Step 6: Deploy to GitHub Pages

### 6.1 Push Your Code

```bash
git add .
git commit -m "Configure deployment to GitHub Pages with Supabase Edge Functions"
git push origin master
```

### 6.2 Monitor Deployment

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Watch the "Deploy to GitHub Pages" workflow
4. Once it's green ✅, your app is live!

### 6.3 Access Your Deployed App

Your app will be available at:
```
https://your-username.github.io/learn-bite/
```

For example: `https://piyush-agarwal20.github.io/learn-bite/`

## Step 7: Set Up Your Database Schema

You need to create the necessary tables in Supabase:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the SQL commands from your existing database schema

**Note:** If you don't have a schema file, you'll need to create tables for:
- `profiles`
- `topics`
- `lessons`
- `custom_quizzes`
- `flashcards`
- `quizzes`
- `progress`
- `bookmarks`
- `notes`

## Troubleshooting

### Issue: Edge Functions returning 401 Unauthorized

**Solution:** Make sure your Edge Functions are checking authentication correctly. The functions should verify the JWT token.

### Issue: CORS errors

**Solution:** The Edge Functions include CORS headers. If you still see issues, check that your Supabase project allows requests from your GitHub Pages domain.

### Issue: Build fails in GitHub Actions

**Solution:**
1. Verify your GitHub secrets are set correctly
2. Check the Actions logs for specific errors
3. Make sure all dependencies are listed in `package.json`

### Issue: OpenAI API not working

**Solution:**
1. Verify your OpenAI API key is valid
2. Check that the secret is set in Supabase:
   ```bash
   supabase secrets list
   ```
3. Ensure you have credits in your OpenAI account

### Issue: Functions not found

**Solution:**
1. Redeploy the functions:
   ```bash
   supabase functions deploy generate-quiz
   supabase functions deploy generate-lesson
   ```
2. Check function logs:
   ```bash
   supabase functions logs generate-quiz
   ```

## Cost Breakdown

### Free Tier (0-100 users/month):
- **GitHub Pages:** Free (unlimited for public repos)
- **Supabase Free Tier:**
  - 500MB Database
  - 2GB Bandwidth
  - 50,000 Monthly Active Users
  - Edge Functions: 500K invocations/month
- **OpenAI:** Pay as you go (~$0.002 per quiz)
  - Estimated: $2-5/month for light usage

### Paid Tier (1000+ users/month):
- **GitHub Pages:** Still Free
- **Supabase Pro:** $25/month
  - 8GB Database
  - 250GB Bandwidth
  - Unlimited Edge Functions
- **OpenAI:** ~$20-50/month (depends on usage)

**Total for 1000 users: ~$45-75/month**

## Environment Variables Reference

### Frontend (.env - for local development only):
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
```

### Supabase Secrets (for Edge Functions):
```bash
OPENAI_API_KEY=sk-xxxxx...
```

### GitHub Actions Secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Security Notes

✅ **Secure:**
- OpenAI API key is stored in Supabase secrets (server-side)
- Edge Functions handle all AI requests
- User authentication required for AI features
- Frontend only has Supabase public key (safe to expose)

❌ **Never commit:**
- `.env` file (already in `.gitignore`)
- Any API keys
- Database passwords

## Next Steps

After deployment:
1. Test all features on your live site
2. Set up database backups in Supabase
3. Monitor usage in Supabase Dashboard
4. Check OpenAI usage/costs in OpenAI Dashboard
5. Set up error monitoring (optional: Sentry, LogRocket)

## Support

If you encounter issues:
1. Check Supabase function logs: `supabase functions logs <function-name>`
2. Check GitHub Actions logs
3. Review browser console for frontend errors
4. Check Supabase Dashboard → Logs

## Useful Commands

```bash
# Deploy all functions
supabase functions deploy

# View function logs
supabase functions logs generate-quiz --tail

# List all secrets
supabase secrets list

# Update a secret
supabase secrets set SECRET_NAME=new-value

# Test function locally
supabase functions serve generate-quiz

# Check project status
supabase status
```

---

**Congratulations!** Your LearnBite app is now deployed with a secure, scalable architecture. 🎉
