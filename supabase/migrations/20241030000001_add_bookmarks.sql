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
