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
} from './progress';
