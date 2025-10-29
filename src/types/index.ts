// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// Topic types
export interface Topic {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  estimated_time: number; // in minutes
  icon: string;
  created_at?: string;
}

// Topic with progress info
export interface TopicWithProgress extends Topic {
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

// Lesson types
export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  content_eli5?: string; // Simple explanation
  order: number;
  order_index?: number; // Alias for order
  estimated_read_time: number;
  estimated_time?: number; // Alias for estimated_read_time
  created_at?: string;
}

// Flashcard types
export interface Flashcard {
  id: string;
  lesson_id: string;
  front_text: string;
  back_text: string;
}

// Quiz types
export interface Quiz {
  id: string;
  lesson_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

// Progress types
export interface UserProgress {
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completion_date?: string;
  time_spent: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlock_condition: string;
}
