import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ProgressBar, PageContainer, LoadingSpinner } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../services/api/progress';
import type { UserStats } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const { data, error } = await getUserStats();

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  const userName = user?.user_metadata?.name || 'there';
  const currentStreak = stats?.currentStreak || 0;
  const lessonsCompleted = stats?.completedLessons || 0;
  const badgesEarned = 0; // TODO: Implement badges system

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
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="pt-4">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-secondary-600 mt-1">Ready to learn something new?</p>
        </div>

        {/* Streak Counter - Prominent */}
        <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-sm opacity-90">Current Streak</p>
              <p className="text-5xl font-bold mt-1">{currentStreak} 🔥</p>
              <p className="text-sm opacity-90 mt-1">days in a row</p>
            </div>
            <div className="text-6xl opacity-20">📚</div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="md" className="text-center">
            <p className="text-2xl font-bold text-primary-600">{lessonsCompleted}</p>
            <p className="text-xs text-secondary-600 mt-1">Lessons</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-2xl font-bold text-accent-600">{currentStreak}</p>
            <p className="text-xs text-secondary-600 mt-1">Day Streak</p>
          </Card>
          <Card padding="md" className="text-center">
            <p className="text-2xl font-bold text-secondary-600">{badgesEarned}</p>
            <p className="text-xs text-secondary-600 mt-1">Badges</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <Card hoverable clickable padding="md" className="text-center" onClick={() => navigate('/topics')}>
            <div className="text-3xl mb-2">📖</div>
            <p className="font-semibold text-secondary-900">Browse Topics</p>
          </Card>
          <Card hoverable clickable padding="md" className="text-center" onClick={() => navigate('/progress')}>
            <div className="text-3xl mb-2">📊</div>
            <p className="font-semibold text-secondary-900">View Progress</p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
