import { supabase } from '../supabase';
import type { Lesson } from '../../types';

/**
 * Fetch all lessons for a specific topic
 */
export async function getLessonsByTopicId(topicId: string) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('topic_id', topicId)
      .order('lesson_order', { ascending: true });

    if (error) throw error;

    return { data: data as Lesson[], error: null };
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single lesson by ID
 */
export async function getLessonById(lessonId: string) {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;

    return { data: data as Lesson, error: null };
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return { data: null, error };
  }
}

/**
 * Fetch lessons with user progress
 */
export async function getLessonsWithProgress(topicId: string, userId: string) {
  try {
    const { data: lessons, error } = await getLessonsByTopicId(topicId);
    if (error || !lessons) throw error;

    // Get user progress for all lessons
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .in('lesson_id', lessons.map(l => l.id));

    const progressMap = new Map(progressData?.map(p => [p.lesson_id, p]) || []);

    const lessonsWithProgress = lessons.map(lesson => ({
      ...lesson,
      completed: progressMap.get(lesson.id)?.completed || false,
      time_spent: progressMap.get(lesson.id)?.time_spent || 0,
    }));

    return { data: lessonsWithProgress, error: null };
  } catch (error) {
    console.error('Error fetching lessons with progress:', error);
    return { data: null, error };
  }
}
