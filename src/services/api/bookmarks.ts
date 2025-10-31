import { supabase } from '../supabase';

export interface Bookmark {
  id: string;
  user_id: string;
  lesson_id: string;
  created_at: string;
}

/**
 * Add a lesson to bookmarks
 */
export async function addBookmark(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('lesson_bookmarks')
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
    })
    .select()
    .single();

  return { data: data as Bookmark | null, error };
}

/**
 * Remove a lesson from bookmarks
 */
export async function removeBookmark(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { error } = await supabase
    .from('lesson_bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId);

  return { data: !error, error };
}

/**
 * Check if a lesson is bookmarked
 */
export async function isBookmarked(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: false, error: null };
  }

  const { data } = await supabase
    .from('lesson_bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  return { data: !!data, error: null };
}

/**
 * Get all bookmarked lessons for the current user
 */
export async function getUserBookmarks() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('lesson_bookmarks')
    .select(`
      *,
      lessons:lesson_id (
        id,
        title,
        estimated_read_time,
        lesson_order,
        topic_id,
        topics:topic_id (
          id,
          title,
          icon,
          category
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

/**
 * Toggle bookmark status for a lesson
 */
export async function toggleBookmark(lessonId: string) {
  const { data: isCurrentlyBookmarked } = await isBookmarked(lessonId);

  if (isCurrentlyBookmarked) {
    return await removeBookmark(lessonId);
  } else {
    return await addBookmark(lessonId);
  }
}
