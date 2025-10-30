import { supabase } from '../supabase';
import type { Quiz } from '../../types';

/**
 * Fetch all quiz questions for a specific lesson
 */
export async function getQuizzesByLessonId(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { data: data as Quiz[], error: null };
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single quiz question by ID
 */
export async function getQuizById(quizId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error) throw error;

    return { data: data as Quiz, error: null };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return { data: null, error };
  }
}
