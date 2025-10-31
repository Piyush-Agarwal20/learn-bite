# 📋 Manual Database Migration Steps

## ⚠️ Important: Apply These Migrations to Complete Setup

Your LearnBite application is **100% complete in code**, but two database tables need to be created manually in Supabase.

## 🔧 How to Apply Migrations

### Step 1: Go to Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)

### Step 2: Create Bookmarks Table
Copy and paste the entire content below, then click **Run**:

```sql
-- Create lesson_bookmarks table
CREATE TABLE IF NOT EXISTS lesson_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Add RLS policies for lesson_bookmarks
ALTER TABLE lesson_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON lesson_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can create own bookmarks"
  ON lesson_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON lesson_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON lesson_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_lesson_id ON lesson_bookmarks(lesson_id);
```

### Step 3: Create Study Notes Table
Copy and paste the entire content below, then click **Run**:

```sql
-- Create lesson_notes table
CREATE TABLE IF NOT EXISTS lesson_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Add RLS policies for lesson_notes
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

-- Users can view their own notes
CREATE POLICY "Users can view own notes"
  ON lesson_notes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own notes
CREATE POLICY "Users can create own notes"
  ON lesson_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON lesson_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON lesson_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON lesson_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_lesson_id ON lesson_notes(lesson_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lesson_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_lesson_notes_updated_at
  BEFORE UPDATE ON lesson_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_notes_updated_at();
```

## ✅ Verify Migrations

After running both SQLs, verify in Supabase:
1. Go to **Table Editor**
2. Check that `lesson_bookmarks` table exists
3. Check that `lesson_notes` table exists

## 🎉 Done!

Once these migrations are applied, your LearnBite application will be **fully functional** with:
- ✅ Bookmarks feature working
- ✅ Study notes feature working
- ✅ All database operations functional

## 📁 Migration Files Location

If needed, the original SQL files are at:
- `supabase/migrations/20241030000001_add_bookmarks.sql`
- `supabase/migrations/20241030000002_add_study_notes.sql`
