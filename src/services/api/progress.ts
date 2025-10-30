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

/**
 * Get progress for all topics with details
 */
export async function getAllTopicsProgress() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get all topics
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('id, title, category, difficulty');

  if (topicsError || !topics) {
    return { data: null, error: topicsError };
  }

  // Get progress for each topic
  const topicsWithProgress = await Promise.all(
    topics.map(async (topic) => {
      const { data: progressData } = await getTopicProgress(topic.id);
      return {
        ...topic,
        progress: progressData?.percentage || 0,
        completedLessons: progressData?.completed || 0,
        totalLessons: progressData?.total || 0,
      };
    })
  );

  return { data: topicsWithProgress, error: null };
}

/**
 * Get weekly activity for the current user
 */
export async function getWeeklyActivity() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekActivity = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const { count } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('completion_date', date.toISOString())
      .lt('completion_date', nextDate.toISOString());

    weekActivity.push({
      day: days[date.getDay()],
      lessons: count || 0,
      date: date.toISOString().split('T')[0],
    });
  }

  return { data: weekActivity, error: null };
}
