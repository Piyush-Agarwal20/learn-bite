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
