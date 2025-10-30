import { supabase } from '../supabase';

export interface LessonNote {
  id: string;
  user_id: string;
  lesson_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get note for a specific lesson
 */
export async function getLessonNote(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('lesson_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  return { data: data as LessonNote | null, error: error?.code === 'PGRST116' ? null : error };
}

/**
 * Save or update note for a lesson
 */
export async function saveLessonNote(lessonId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  // If content is empty, delete the note
  if (!content.trim()) {
    return await deleteLessonNote(lessonId);
  }

  const { data, error } = await supabase
    .from('lesson_notes')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        content: content.trim(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,lesson_id',
      }
    )
    .select()
    .single();

  return { data: data as LessonNote | null, error };
}

/**
 * Delete note for a lesson
 */
export async function deleteLessonNote(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { error } = await supabase
    .from('lesson_notes')
    .delete()
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId);

  return { data: !error, error };
}

/**
 * Get all notes for the current user
 */
export async function getAllUserNotes() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('lesson_notes')
    .select(`
      *,
      lessons:lesson_id (
        id,
        title,
        topic_id,
        topics:topic_id (
          id,
          title,
          icon
        )
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return { data, error };
}
