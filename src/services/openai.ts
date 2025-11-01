import { supabase } from './supabase';

export interface QuizGenerationParams {
  topic: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  focusAreas: string;
  numberOfQuestions: number;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

/**
 * Generate quiz questions using Supabase Edge Function
 * This calls the secure backend function instead of exposing OpenAI API key
 */
export async function generateQuizQuestions(
  params: QuizGenerationParams
): Promise<GeneratedQuestion[]> {
  try {
    console.log('🔵 Starting quiz generation with params:', params);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated - Please log in again');
    }

    console.log('🔵 Calling Edge Function generate-quiz...');

    const { data, error } = await supabase.functions.invoke('generate-quiz', {
      body: params,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    console.log('🔵 Edge Function response:', { data, error });

    if (error) {
      console.error('🔴 Edge Function error:', error);
      throw new Error(error.message || 'Edge Function failed');
    }

    if (data?.error) {
      console.error('🔴 Server returned error:', data.error);
      throw new Error(data.error);
    }

    if (!data?.questions || !Array.isArray(data.questions)) {
      console.error('🔴 Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    console.log('✅ Quiz generated successfully with', data.questions.length, 'questions');
    return data.questions;
  } catch (error: any) {
    console.error('🔴 Quiz Generation Error:', error);
    throw new Error(`Failed to generate quiz: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Generate lesson content using Supabase Edge Function
 * This calls the secure backend function instead of exposing OpenAI API key
 */
export async function generateLessonContent(
  topic: string,
  level: string,
  specificFocus: string
): Promise<string> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('generate-lesson', {
      body: { topic, level, specificFocus },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.content) {
      throw new Error('Invalid response format from server');
    }

    return data.content;
  } catch (error: any) {
    console.error('Lesson Generation Error:', error);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}
