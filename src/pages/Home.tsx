import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ProgressBar, PageContainer, LoadingSpinner } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats, getContinueLearning, getRecommendedTopics } from '../services/api';
import type { UserStats } from '../types';
import { BookOpen, TrendingUp, Clock } from 'lucide-react';

interface ContinueLearningData {
  lesson: {
    id: string;
    title: string;
    estimated_read_time: number;
  };
  topic: {
    id: string;
    title: string;
    icon: string;
    category: string;
  };
  completedCount: number;
  totalCount: number;
}

interface RecommendedTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  progress: number;
  lessonCount: number;
}

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [continueLearning, setContinueLearning] = useState<ContinueLearningData | null>(null);
  const [recommendedTopics, setRecommendedTopics] = useState<RecommendedTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [statsResult, continueResult, recommendedResult] = await Promise.all([
        getUserStats(),
        getContinueLearning(),
        getRecommendedTopics(),
      ]);

      if (!statsResult.error && statsResult.data) {
        setStats(statsResult.data);
      }

      if (!continueResult.error && continueResult.data) {
        setContinueLearning(continueResult.data);
      }

      if (!recommendedResult.error && recommendedResult.data) {
        setRecommendedTopics(recommendedResult.data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';
  const currentStreak = stats?.currentStreak || 0;
  const lessonsCompleted = stats?.completedLessons || 0;
  const progressPercentage = stats?.progressPercentage || 0;

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-24">
        {/* Welcome Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-secondary-600 mt-1">Ready to learn something new?</p>
        </div>

        {/* Streak Counter - Prominent */}
        <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="flex items-center justify-between text-white">
            <div className="text-left">
              <p className="text-sm opacity-90">Current Streak</p>
              <p className="text-5xl font-bold mt-1">{currentStreak} 🔥</p>
              <p className="text-sm opacity-90 mt-1">days in a row</p>
            </div>
            <div className="text-6xl opacity-20">📚</div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="md" className="text-left">
            <p className="text-2xl font-bold text-primary-600">{lessonsCompleted}</p>
            <p className="text-xs text-secondary-600 mt-1">Lessons</p>
          </Card>
          <Card padding="md" className="text-left">
            <p className="text-2xl font-bold text-accent-600">{currentStreak}</p>
            <p className="text-xs text-secondary-600 mt-1">Day Streak</p>
          </Card>
          <Card padding="md" className="text-left">
            <p className="text-2xl font-bold text-secondary-600">{progressPercentage}%</p>
            <p className="text-xs text-secondary-600 mt-1">Progress</p>
          </Card>
        </div>

        {/* Continue Learning */}
        {continueLearning && (
          <Card padding="lg" variant="elevated">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-secondary-900 text-left">Continue Learning</h2>
            </div>
            <div
              className="p-4 bg-primary-50 rounded-lg cursor-pointer hover:bg-primary-100 transition-colors"
              onClick={() => navigate(`/topics/${continueLearning.topic.id}/lessons/${continueLearning.lesson.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-left flex-1">
                  <p className="text-sm text-primary-600 font-medium">{continueLearning.topic.title}</p>
                  <h3 className="text-lg font-bold text-secondary-900 mt-1">{continueLearning.lesson.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-secondary-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {continueLearning.lesson.estimated_read_time} min
                    </span>
                    <span className="text-xs text-secondary-600">
                      {continueLearning.completedCount}/{continueLearning.totalCount} lessons complete
                    </span>
                  </div>
                </div>
                <div className="text-4xl">{continueLearning.topic.icon}</div>
              </div>
              <ProgressBar
                progress={(continueLearning.completedCount / continueLearning.totalCount) * 100}
                color="primary"
              />
            </div>
          </Card>
        )}

        {/* Recommended Topics */}
        {recommendedTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-accent-600" />
              <h2 className="text-xl font-bold text-secondary-900 text-left">Recommended for You</h2>
            </div>
            <div className="space-y-3">
              {recommendedTopics.map((topic) => (
                <Card
                  key={topic.id}
                  padding="md"
                  hoverable
                  clickable
                  onClick={() => navigate(`/topics/${topic.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{topic.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-bold text-secondary-900">{topic.title}</h3>
                          <p className="text-xs text-secondary-500">{topic.category}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-secondary-100 text-secondary-700 rounded-full">
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 mt-1 line-clamp-2">{topic.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar progress={topic.progress} color="accent" />
                        <span className="text-xs text-secondary-600 whitespace-nowrap">
                          {topic.progress}%
                        </span>
                      </div>
                      <p className="text-xs text-secondary-500 mt-1">{topic.lessonCount} lessons</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card hoverable clickable padding="md" className="text-left" onClick={() => navigate('/topics')}>
            <div className="text-3xl mb-2">📖</div>
            <p className="font-semibold text-secondary-900">Browse Topics</p>
            <p className="text-xs text-secondary-600 mt-1">Explore all courses</p>
          </Card>
          <Card hoverable clickable padding="md" className="text-left" onClick={() => navigate('/progress')}>
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-secondary-900">View Progress</p>
            <p className="text-xs text-secondary-600 mt-1">Track your journey</p>
          </Card>
          <Card hoverable clickable padding="md" className="text-left" onClick={() => navigate('/quiz-generator')}>
            <div className="text-3xl mb-2">✨</div>
            <p className="font-semibold text-secondary-900">AI Quiz Generator</p>
            <p className="text-xs text-secondary-600 mt-1">Create custom quizzes</p>
          </Card>
          <Card hoverable clickable padding="md" className="text-left" onClick={() => navigate('/custom-quizzes')}>
            <div className="text-3xl mb-2">🎯</div>
            <p className="font-semibold text-secondary-900">My Quizzes</p>
            <p className="text-xs text-secondary-600 mt-1">View saved quizzes</p>
          </Card>
        </div>

        {/* Empty State for New Users */}
        {!continueLearning && recommendedTopics.length === 0 && (
          <Card padding="lg" className="text-left">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Start Your Learning Journey!</h3>
              <p className="text-secondary-600 mb-4">Explore topics and begin learning today</p>
              <Button onClick={() => navigate('/topics')} variant="primary" size="lg">
                Browse Topics
              </Button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default Home;
