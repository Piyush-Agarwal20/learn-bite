-- Sample data for development/testing
-- This file is separate from migrations and can be run multiple times

-- Clear existing sample data (optional)
-- TRUNCATE topics, lessons, achievements CASCADE;

-- Sample Topics
INSERT INTO topics (title, category, difficulty, description, estimated_time, icon)
VALUES
  ('Python Programming', 'Technology', 'beginner', 'Learn Python from scratch with hands-on examples', 120, '🐍'),
  ('Digital Marketing', 'Business', 'beginner', 'Master the fundamentals of digital marketing', 90, '📱'),
  ('Quantum Physics', 'Science', 'advanced', 'Explore the fascinating world of quantum mechanics', 180, '⚛️'),
  ('UI/UX Design', 'Technology', 'intermediate', 'Create beautiful and intuitive user interfaces', 100, '🎨'),
  ('Spanish Basics', 'Languages', 'beginner', 'Learn conversational Spanish for everyday use', 80, '🇪🇸'),
  ('Psychology 101', 'Science', 'beginner', 'Introduction to human behavior and mental processes', 110, '🧠')
ON CONFLICT DO NOTHING;

-- Sample Lessons for Python Programming
INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Introduction to Python',
  'Python is a high-level, interpreted programming language known for its simplicity and readability. In this lesson, we''ll explore why Python is one of the most popular programming languages in the world.',
  1,
  5
FROM topics WHERE title = 'Python Programming'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Variables and Data Types',
  'Variables are containers for storing data values. Python has various data types including integers, floats, strings, and booleans. Let''s learn how to use them effectively.',
  2,
  5
FROM topics WHERE title = 'Python Programming'
ON CONFLICT DO NOTHING;

INSERT INTO lessons (topic_id, title, content, lesson_order, estimated_read_time)
SELECT
  id,
  'Functions and Parameters',
  'Functions are reusable blocks of code that perform specific tasks. Learn how to define functions, pass parameters, and return values to make your code more organized.',
  3,
  5
FROM topics WHERE title = 'Python Programming'
ON CONFLICT DO NOTHING;

-- Sample Achievements
INSERT INTO achievements (name, description, icon, unlock_condition)
VALUES
  ('First Lesson', 'Complete your first lesson', '🎯', 'complete_1_lesson'),
  ('7 Day Streak', 'Maintain a 7-day learning streak', '🔥', 'streak_7_days'),
  ('Quick Learner', 'Complete 5 lessons in one day', '⚡', 'complete_5_lessons_day'),
  ('Night Owl', 'Complete a lesson after 10 PM', '🦉', 'complete_lesson_night'),
  ('Early Bird', 'Complete a lesson before 7 AM', '🐦', 'complete_lesson_morning')
ON CONFLICT DO NOTHING;
