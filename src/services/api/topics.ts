import { supabase } from '../supabase';
import type { Topic, TopicWithProgress } from '../../types';

/**
 * Fetch all topics with optional filtering
 */
export async function getTopics(options?: {
  category?: string;
  difficulty?: string;
  searchQuery?: string;
}) {
  try {
    let query = supabase.from('topics').select('*').order('created_at', { ascending: false });

    // Apply filters
    if (options?.category && options.category !== 'All') {
      query = query.eq('category', options.category);
    }

    if (options?.difficulty) {
      query = query.eq('difficulty', options.difficulty);
    }

    if (options?.searchQuery) {
      query = query.ilike('title', `%${options.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data: data as Topic[], error: null };
  } catch (error) {
    console.error('Error fetching topics:', error);
    return { data: null, error };
  }
}

/**
 * Fetch a single topic by ID
 */
export async function getTopicById(topicId: string) {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', topicId)
      .single();

    if (error) throw error;

    return { data: data as Topic, error: null };
  } catch (error) {
    console.error('Error fetching topic:', error);
    return { data: null, error };
  }
}

/**
 * Fetch topics with user progress information
 */
export async function getTopicsWithProgress(userId: string, options?: {
  category?: string;
  difficulty?: string;
  searchQuery?: string;
}) {
  try {
    // First get all topics
    const { data: topics, error: topicsError } = await getTopics(options);
    if (topicsError || !topics) throw topicsError;

    // For each topic, get lesson count and user progress
    const topicsWithProgress = await Promise.all(
      topics.map(async (topic) => {
        // Get total lessons count
        const { count: totalLessons } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('topic_id', topic.id);

        // Get lesson IDs for this topic first
        const { data: topicLessons } = await supabase
          .from('lessons')
          .select('id')
          .eq('topic_id', topic.id);

        const lessonIds = topicLessons?.map(l => l.id) || [];

        // Get completed lessons count
        let completedLessons = 0;
        if (lessonIds.length > 0) {
          const { count } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('completed', true)
            .in('lesson_id', lessonIds);
          completedLessons = count || 0;
        }

        const total = totalLessons || 0;
        const completed = completedLessons;
        const progress_percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          ...topic,
          total_lessons: total,
          completed_lessons: completed,
          progress_percentage,
        } as TopicWithProgress;
      })
    );

    return { data: topicsWithProgress, error: null };
  } catch (error) {
    console.error('Error fetching topics with progress:', error);
    return { data: null, error };
  }
}

/**
 * Get all unique categories from topics
 */
export async function getTopicCategories() {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('category')
      .order('category');

    if (error) throw error;

    // Get unique categories
    const categories = ['All', ...new Set(data.map((item) => item.category))];

    return { data: categories, error: null };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: ['All'], error };
  }
}
