-- Database Tests
-- Run with: supabase test db

BEGIN;

-- Test 1: Check if all tables exist
SELECT plan(11);

SELECT has_table('public', 'profiles', 'profiles table should exist');
SELECT has_table('public', 'user_preferences', 'user_preferences table should exist');
SELECT has_table('public', 'topics', 'topics table should exist');
SELECT has_table('public', 'lessons', 'lessons table should exist');
SELECT has_table('public', 'flashcards', 'flashcards table should exist');
SELECT has_table('public', 'quizzes', 'quizzes table should exist');
SELECT has_table('public', 'user_progress', 'user_progress table should exist');
SELECT has_table('public', 'user_streaks', 'user_streaks table should exist');
SELECT has_table('public', 'achievements', 'achievements table should exist');
SELECT has_table('public', 'user_achievements', 'user_achievements table should exist');
SELECT has_table('public', 'bookmarks', 'bookmarks table should exist');

SELECT finish();

ROLLBACK;
