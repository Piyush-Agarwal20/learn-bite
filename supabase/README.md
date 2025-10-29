# LearnBite Supabase Configuration

This folder contains all Supabase-related configuration, migrations, functions, and utilities.

## 📁 Folder Structure

```
supabase/
├── config.toml              # Supabase project configuration
├── migrations/              # Database migrations (versioned)
│   └── 20241029000001_initial_schema.sql
├── functions/               # Edge Functions (serverless)
│   ├── _shared/            # Shared utilities
│   │   └── supabase.ts     # Supabase client helpers
│   └── hello/              # Example function
│       └── index.ts
├── seeds/                   # Sample data for development
│   └── sample_data.sql
├── tests/                   # Database tests
│   └── database.test.sql
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
```bash
# Install Supabase CLI
npm install -g supabase
```

### Link to Your Project
```bash
supabase link --project-ref rvmgfwdqjnmwixxjqcrz
```

### Run Migrations
```bash
# Apply all migrations to remote database
supabase db push

# Or apply migrations locally
supabase db reset
```

### Seed Sample Data
```bash
# Load sample data into database
supabase db seed
```

## 📝 Migrations

### Create New Migration
```bash
supabase migration new add_new_feature
```

This creates a new file in `migrations/` folder.

### Apply Migrations
```bash
# To remote (production)
supabase db push

# To local
supabase db reset
```

## ⚡ Edge Functions

### Deploy Function
```bash
# Deploy single function
supabase functions deploy hello

# Deploy all functions
supabase functions deploy
```

### Invoke Function
```bash
# Test locally
supabase functions serve

# Invoke
curl -i --location --request POST 'http://localhost:54321/functions/v1/hello' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json'
```

## 🧪 Testing

### Run Database Tests
```bash
supabase test db
```

## 🔗 Useful Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# View database
supabase db studio

# Generate TypeScript types
supabase gen types typescript --local > src/types/database.ts

# View logs
supabase functions logs hello
```

## 📚 Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Database Migrations](https://supabase.com/docs/guides/cli/managing-migrations)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)

## 🔑 Environment Variables

Required for local development (create `.env` in this folder):

```env
SUPABASE_URL=https://rvmgfwdqjnmwixxjqcrz.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🛠️ Development Workflow

1. **Make changes** to migrations or functions
2. **Test locally**:
   ```bash
   supabase start
   supabase db reset  # Apply migrations
   ```
3. **Test your app** against local Supabase
4. **Deploy** when ready:
   ```bash
   supabase db push
   supabase functions deploy
   ```

## 📊 Database Schema

The initial schema includes:

**Core Tables:**
- `profiles` - User profiles
- `user_preferences` - User settings
- `topics` - Learning topics
- `lessons` - Lesson content
- `flashcards` - Flashcard content
- `quizzes` - Quiz questions

**Progress Tracking:**
- `user_progress` - Lesson completion
- `user_streaks` - Learning streaks
- `achievements` - Achievement definitions
- `user_achievements` - User achievements
- `bookmarks` - Bookmarked lessons

All tables have **Row Level Security (RLS)** enabled with appropriate policies.
