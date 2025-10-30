import { supabase } from '../supabase';
import type { Flashcard } from '../../types';

/**
 * Fetch all flashcards for a specific lesson
 */
export async function getFlashcardsByLessonId(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { data: data as Flashcard[], error: null };
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single flashcard by ID
 */
export async function getFlashcardById(flashcardId: string) {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single();

    if (error) throw error;

    return { data: data as Flashcard, error: null };
  } catch (error) {
    console.error('Error fetching flashcard:', error);
    return { data: null, error };
  }
}
