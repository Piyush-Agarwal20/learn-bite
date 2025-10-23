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
  estimated_time: number;
}

// Lesson types
export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  order: number;
  estimated_read_time: number;
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
