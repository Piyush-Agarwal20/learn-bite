-- Create custom_quizzes table for AI-generated quizzes
CREATE TABLE IF NOT EXISTS custom_quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  level TEXT NOT NULL,
  focus_areas TEXT,
  questions JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for custom_quizzes
ALTER TABLE custom_quizzes ENABLE ROW LEVEL SECURITY;

-- Users can view their own custom quizzes
CREATE POLICY "Users can view own custom quizzes"
  ON custom_quizzes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own custom quizzes
CREATE POLICY "Users can create own custom quizzes"
  ON custom_quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own custom quizzes
CREATE POLICY "Users can delete own custom quizzes"
  ON custom_quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_custom_quizzes_user_id ON custom_quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_quizzes_created_at ON custom_quizzes(created_at DESC);
