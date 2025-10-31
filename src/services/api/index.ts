// Topics API
export {
  getTopics,
  getTopicById,
  getTopicsWithProgress,
  getTopicCategories,
} from './topics';

// Lessons API
export {
  getLessonsByTopicId,
  getLessonById,
  getLessonsWithProgress,
} from './lessons';

// Progress API
export {
  markLessonComplete,
  getLessonProgress,
  getUserProgress,
  getUserStats,
  getTopicProgress,
  getAllTopicsProgress,
  getWeeklyActivity,
} from './progress';

// Flashcards API
export {
  getFlashcardsByLessonId,
  getFlashcardById,
} from './flashcards';

// Quizzes API
export {
  getQuizzesByLessonId,
  getQuizById,
} from './quizzes';

// Profiles API
export {
  getProfile,
  updateProfile,
} from './profiles';
export type { Profile } from './profiles';

// Home API
export {
  getContinueLearning,
  getRecommendedTopics,
  getRecentActivity,
} from './home';

// Bookmarks API
export {
  addBookmark,
  removeBookmark,
  isBookmarked,
  getUserBookmarks,
  toggleBookmark,
} from './bookmarks';
export type { Bookmark } from './bookmarks';

// Notes API
export {
  getLessonNote,
  saveLessonNote,
  deleteLessonNote,
  getAllUserNotes,
} from './notes';
export type { LessonNote } from './notes';

// Analytics API
export {
  getDailyActivity,
  getTopicCompletionRates,
  getLearningTimeStats,
  getQuizPerformance,
  getLearningPatterns,
} from './analytics';
