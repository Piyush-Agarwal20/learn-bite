import { supabase } from '../supabase';
import { generateQuizQuestions, type QuizGenerationParams, type GeneratedQuestion } from '../openai';

export interface CustomQuiz {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  level: string;
  focus_areas: string;
  questions: GeneratedQuestion[];
  created_at: string;
}

/**
 * Generate and save a custom quiz using AI
 */
export async function createCustomQuiz(params: QuizGenerationParams) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  try {
    // Generate questions using OpenAI
    const questions = await generateQuizQuestions(params);

    // Save to database
    const { data, error } = await supabase
      .from('custom_quizzes')
      .insert({
        user_id: user.id,
        title: `${params.topic} - ${params.level}`,
        topic: params.topic,
        level: params.level,
        focus_areas: params.focusAreas,
        questions: questions,
      })
      .select()
      .single();

    return { data: data as CustomQuiz | null, error };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Get all custom quizzes for the current user
 */
export async function getUserCustomQuizzes() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('custom_quizzes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return { data: data as CustomQuiz[] | null, error };
}

/**
 * Get a specific custom quiz
 */
export async function getCustomQuizById(quizId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { data, error } = await supabase
    .from('custom_quizzes')
    .select('*')
    .eq('id', quizId)
    .eq('user_id', user.id)
    .single();

  return { data: data as CustomQuiz | null, error };
}

/**
 * Delete a custom quiz
 */
export async function deleteCustomQuiz(quizId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: new Error('Not authenticated') };
  }

  const { error } = await supabase
    .from('custom_quizzes')
    .delete()
    .eq('id', quizId)
    .eq('user_id', user.id);

  return { data: !error, error };
}
