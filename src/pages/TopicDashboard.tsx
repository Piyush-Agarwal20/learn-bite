import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Card, ProgressBar, LoadingSpinner, Button } from '../components';
import { getTopicById, getLessonsByTopicId } from '../services/api';
import { getTopicProgress, getUserProgress } from '../services/api/progress';
import type { Topic, Lesson, UserProgress } from '../types';

const TopicDashboard = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicProgressData, setTopicProgressData] = useState<{ total: number; completed: number; percentage: number } | null>(null);
  const [userProgressMap, setUserProgressMap] = useState<Map<string, UserProgress>>(new Map());

  useEffect(() => {
    async function fetchData() {
      if (!topicId) return;

      setLoading(true);
      setError(null);

      // Fetch topic, lessons, and progress in parallel
      const [topicResult, lessonsResult, progressResult, userProgressResult] = await Promise.all([
        getTopicById(topicId),
        getLessonsByTopicId(topicId),
        getTopicProgress(topicId),
        getUserProgress(),
      ]);

      if (topicResult.error) {
        setError('Failed to load topic. Please try again.');
        console.error(topicResult.error);
      } else if (topicResult.data) {
        setTopic(topicResult.data);
      }

      if (lessonsResult.error) {
        setError('Failed to load lessons. Please try again.');
        console.error(lessonsResult.error);
      } else if (lessonsResult.data) {
        setLessons(lessonsResult.data);
      }

      if (progressResult.data) {
        setTopicProgressData(progressResult.data);
      }

      if (userProgressResult.data) {
        const progressMap = new Map<string, UserProgress>();
        userProgressResult.data.forEach((progress) => {
          progressMap.set(progress.lesson_id, progress);
        });
        setUserProgressMap(progressMap);
      }

      setLoading(false);
    }

    fetchData();
  }, [topicId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'intermediate':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'advanced':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-secondary-600 bg-secondary-50 dark:bg-secondary-800 border-secondary-200';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !topic) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg text-red-600 mb-4">{error || 'Topic not found'}</p>
          <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/topics')}
          className="flex items-center gap-2 text-secondary-600 theme-text-secondary hover:text-secondary-900 theme-text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Topics</span>
        </button>

        {/* Topic Header */}
        <Card padding="lg">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{topic.icon}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-secondary-900 theme-text-primary mb-2">{topic.title}</h1>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded border capitalize ${getDifficultyColor(
                    topic.difficulty
                  )}`}
                >
                  {topic.difficulty}
                </span>
                <span className="text-xs text-secondary-500 theme-text-tertiary bg-secondary-50 dark:bg-secondary-800 px-3 py-1 rounded">
                  {topic.category}
                </span>
              </div>
              <p className="text-secondary-700 mb-4">{topic.description}</p>
              <div className="flex items-center gap-6 text-sm text-secondary-600 theme-text-secondary dark:text-secondary-400">
                <span className="flex items-center gap-2">
                  <span>📚</span>
                  <span>{lessons.length} lessons</span>
                </span>
                <span className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>{formatTime(topic.estimated_time)}</span>
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary mb-4">Your Progress</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-600 theme-text-secondary dark:text-secondary-400">
                {topicProgressData?.completed || 0} of {topicProgressData?.total || lessons.length} lessons completed
              </span>
              <span className="text-secondary-900 theme-text-primary font-semibold">{topicProgressData?.percentage || 0}%</span>
            </div>
            <ProgressBar progress={topicProgressData?.percentage || 0} />
          </div>
        </Card>

        {/* Lessons List */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 theme-text-primary mb-4">Lessons</h2>
          {lessons.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-lg text-secondary-600 theme-text-secondary dark:text-secondary-400">No lessons available yet</p>
                <p className="text-sm text-secondary-500 theme-text-tertiary mt-2">Check back soon for new content!</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <Card
                  key={lesson.id}
                  hoverable
                  clickable
                  padding="lg"
                  onClick={() => navigate(`/lesson/${topicId}/${lesson.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Lesson Number */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary-900 theme-text-primary mb-1">{lesson.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-secondary-600 theme-text-secondary dark:text-secondary-400">
                        <span className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{lesson.estimated_read_time}m read</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {userProgressMap.get(lesson.id)?.completed ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-secondary-300" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Start Learning Button */}
        {lessons.length > 0 && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-secondary-200 md:static md:border-0 md:bg-transparent md:p-0">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate(`/lesson/${topicId}/${lessons[0].id}`)}
            >
              Start Learning
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default TopicDashboard;
