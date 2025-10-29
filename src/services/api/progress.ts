import { supabase } from '../supabase';
import type { UserProgress } from '../../types';

/**
 * Mark a lesson as completed for the current user
 */
export async function markLessonComplete(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completion_date: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,lesson_id',
      }
    )
    .select()
    .single();

  return { data: data as UserProgress | null, error };
}

/**
 * Get user's progress for a specific lesson
 */
export async function getLessonProgress(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  return { data: data as UserProgress | null, error };
}

/**
 * Get all progress for current user
 */
export async function getUserProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id);

  return { data: data as UserProgress[] | null, error };
}

/**
 * Get user's progress statistics
 */
export async function getUserStats() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get completed lessons count
  const { count: completedCount } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true);

  // Get total lessons count
  const { count: totalLessons } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true });

  // Get current streak (simplified - based on last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentActivity } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .gte('completion_date', sevenDaysAgo.toISOString());

  return {
    data: {
      completedLessons: completedCount || 0,
      totalLessons: totalLessons || 0,
      currentStreak: recentActivity || 0,
      progressPercentage: totalLessons ? Math.round(((completedCount || 0) / totalLessons) * 100) : 0,
    },
    error: null,
  };
}

/**
 * Get progress for a specific topic
 */
export async function getTopicProgress(topicId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get all lessons in this topic
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id')
    .eq('topic_id', topicId);

  if (!lessons || lessons.length === 0) {
    return { data: { total: 0, completed: 0, percentage: 0 }, error: null };
  }

  const lessonIds = lessons.map(l => l.id);

  // Get completed lessons in this topic
  const { count: completedCount } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('completed', true)
    .in('lesson_id', lessonIds);

  return {
    data: {
      total: lessons.length,
      completed: completedCount || 0,
      percentage: Math.round(((completedCount || 0) / lessons.length) * 100),
    },
    error: null,
  };
}
