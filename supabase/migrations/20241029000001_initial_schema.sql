-- LearnBite Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  learning_goal TEXT DEFAULT 'career',
  difficulty_level TEXT DEFAULT 'beginner',
  reminder_time TIME DEFAULT '09:00:00',
  daily_reminder_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TOPICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  description TEXT,
  estimated_time INTEGER, -- in minutes
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. LESSONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  lesson_order INTEGER NOT NULL,
  estimated_read_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. FLASHCARDS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. QUIZZES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. USER PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- 8. USER STREAKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  unlock_condition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- 11. BOOKMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Sample Topics
INSERT INTO topics (title, category, difficulty, description, estimated_time, icon) VALUES
('Python Programming', 'Technology', 'beginner', 'Learn Python from scratch with hands-on examples', 120, '🐍'),
('Digital Marketing', 'Business', 'beginner', 'Master the fundamentals of digital marketing', 90, '📱'),
('Quantum Physics', 'Science', 'advanced', 'Explore the fascinating world of quantum mechanics', 180, '⚛️'),
('UI/UX Design', 'Technology', 'intermediate', 'Create beautiful and intuitive user interfaces', 100, '🎨'),
('Spanish Basics', 'Languages', 'beginner', 'Learn conversational Spanish for everyday use', 80, '🇪🇸'),
('Psychology 101', 'Science', 'beginner', 'Introduction to human behavior and mental processes', 110, '🧠');

-- Sample Lessons for Python Programming (topic_id will be dynamic)
INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Introduction to Python',
  'Python is a high-level, interpreted programming language known for its simplicity and readability. In this lesson, we''ll explore why Python is one of the most popular programming languages in the world.',
  1,
  5
FROM topics WHERE title = 'Python Programming';

INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Variables and Data Types',
  'Variables are containers for storing data values. Python has various data types including integers, floats, strings, and booleans. Let''s learn how to use them effectively.',
  2,
  5
FROM topics WHERE title = 'Python Programming';

INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Functions and Parameters',
  'Functions are reusable blocks of code that perform specific tasks. Learn how to define functions, pass parameters, and return values to make your code more organized.',
  3,
  5
FROM topics WHERE title = 'Python Programming';

-- Sample Achievements
INSERT INTO achievements (name, description, icon, unlock_condition) VALUES
('First Lesson', 'Complete your first lesson', '🎯', 'complete_1_lesson'),
('7 Day Streak', 'Maintain a 7-day learning streak', '🔥', 'streak_7_days'),
('Quick Learner', 'Complete 5 lessons in one day', '⚡', 'complete_5_lessons_day'),
('Night Owl', 'Complete a lesson after 10 PM', '🦉', 'complete_lesson_night'),
('Early Bird', 'Complete a lesson before 7 AM', '🐦', 'complete_lesson_morning');

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- User Preferences: Users can only access their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Progress: Users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- User Streaks: Users can only access their own streaks
CREATE POLICY "Users can view own streaks" ON user_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON user_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON user_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- User Achievements: Users can only access their own achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookmarks: Users can only access their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for topics, lessons, flashcards, quizzes, achievements
CREATE POLICY "Topics are viewable by everyone" ON topics
  FOR SELECT USING (true);

CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Flashcards are viewable by everyone" ON flashcards
  FOR SELECT USING (true);

CREATE POLICY "Quizzes are viewable by everyone" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "Achievements are viewable by everyone" ON achievements
  FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  INSERT INTO user_streaks (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Your database schema is now ready!
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Check that RLS policies are active
