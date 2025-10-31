import { supabase } from '../supabase';

/**
 * Get next lesson to continue for the user
 */
export async function getContinueLearning() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get all topics
  const { data: topics } = await supabase
    .from('topics')
    .select('id, title, icon, category');

  if (!topics || topics.length === 0) {
    return { data: null, error: null };
  }

  // For each topic, find the first incomplete lesson
  for (const topic of topics) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('topic_id', topic.id)
      .order('lesson_order', { ascending: true });

    if (!lessons || lessons.length === 0) continue;

    // Check which lessons are completed
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .in('lesson_id', lessons.map(l => l.id));

    const completedIds = new Set(
      progress?.filter(p => p.completed).map(p => p.lesson_id) || []
    );

    // Find first incomplete lesson
    const nextLesson = lessons.find(l => !completedIds.has(l.id));

    if (nextLesson) {
      return {
        data: {
          lesson: nextLesson,
          topic: topic,
          completedCount: completedIds.size,
          totalCount: lessons.length,
        },
        error: null,
      };
    }
  }

  return { data: null, error: null };
}

/**
 * Get recommended topics for the user based on incomplete progress
 */
export async function getRecommendedTopics() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // Get all topics
  const { data: topics } = await supabase
    .from('topics')
    .select('*')
    .limit(6);

  if (!topics) {
    return { data: null, error: null };
  }

  // Get progress for each topic
  const topicsWithProgress = await Promise.all(
    topics.map(async (topic) => {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('topic_id', topic.id);

      const lessonCount = lessons?.length || 0;

      if (lessonCount === 0) {
        return { ...topic, progress: 0, lessonCount: 0 };
      }

      const { count: progress } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('lesson_id', lessons!.map(l => l.id));

      const completedCount = progress || 0;
      const progressPercentage = Math.round((completedCount / lessonCount) * 100);

      return {
        ...topic,
        progress: progressPercentage,
        lessonCount,
      };
    })
  );

  // Sort by progress (incomplete topics first, then by progress)
  const recommended = topicsWithProgress
    .filter(t => t.progress < 100) // Only incomplete topics
    .sort((a, b) => b.progress - a.progress) // Higher progress first (continue learning)
    .slice(0, 3);

  return { data: recommended, error: null };
}

/**
 * Get recent activity for the user
 */
export async function getRecentActivity() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data: recentProgress } = await supabase
    .from('user_progress')
    .select(`
      lesson_id,
      completed,
      completion_date,
      lessons:lesson_id (
        title,
        topic_id,
        topics:topic_id (
          title,
          icon
        )
      )
    `)
    .eq('user_id', user.id)
    .eq('completed', true)
    .order('completion_date', { ascending: false })
    .limit(5);

  return { data: recentProgress, error: null };
}
