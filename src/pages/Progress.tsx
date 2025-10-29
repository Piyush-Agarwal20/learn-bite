import { useState, useEffect } from 'react';
import { Card, ProgressBar, PageContainer, LoadingSpinner } from '../components';
import { getUserStats } from '../services/api/progress';
import type { UserStats } from '../types';

const Progress = () => {
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

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  const topicProgress = [
    { name: 'Python Programming', progress: 65, lessons: '15/24', color: 'primary' as const },
    { name: 'Digital Marketing', progress: 45, lessons: '9/18', color: 'accent' as const },
    { name: 'Quantum Physics', progress: 30, lessons: '10/32', color: 'secondary' as const },
  ];

  const recentAchievements = [
    { id: 1, title: 'First Lesson', icon: '🎯', date: '2 days ago' },
    { id: 2, title: '7 Day Streak', icon: '🔥', date: 'Today' },
    { id: 3, title: 'Quick Learner', icon: '⚡', date: '5 days ago' },
    { id: 4, title: 'Night Owl', icon: '🦉', date: '1 week ago' },
  ];

  const weeklyActivity = [
    { day: 'Mon', lessons: 3 },
    { day: 'Tue', lessons: 2 },
    { day: 'Wed', lessons: 4 },
    { day: 'Thu', lessons: 1 },
    { day: 'Fri', lessons: 3 },
    { day: 'Sat', lessons: 2 },
    { day: 'Sun', lessons: 3 },
  ];

  const maxLessons = Math.max(...weeklyActivity.map((d) => d.lessons));

  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Your Progress</h1>
          <p className="text-secondary-600 mt-1">Track your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card padding="md" variant="elevated" className="text-center">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold text-primary-600">{stats?.completedLessons || 0}</p>
            <p className="text-xs text-secondary-600 mt-1">Lessons Completed</p>
          </Card>

          <Card padding="md" variant="elevated" className="text-center">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-accent-600">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-secondary-600 mt-1">Current Streak</p>
          </Card>

          <Card padding="md" variant="elevated" className="text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-2xl font-bold text-secondary-600">{stats?.progressPercentage || 0}%</p>
            <p className="text-xs text-secondary-600 mt-1">Overall Progress</p>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">This Week</h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                  style={{
                    height: `${(day.lessons / maxLessons) * 100}%`,
                    minHeight: day.lessons > 0 ? '20px' : '4px',
                  }}
                />
                <p className="text-xs text-secondary-600 mt-2">{day.day}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Topic Progress */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Course Progress</h2>
          <div className="space-y-4">
            {topicProgress.map((topic) => (
              <div key={topic.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-secondary-900">{topic.name}</span>
                  <span className="text-sm text-secondary-600">{topic.lessons}</span>
                </div>
                <ProgressBar progress={topic.progress} color={topic.color} />
              </div>
            ))}
          </div>
        </Card>

        {/* Achievements */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Recent Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg"
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  {achievement.title}
                </p>
                <p className="text-xs text-secondary-500 mt-1">{achievement.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Streak Calendar Placeholder */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Streak Calendar</h2>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-secondary-600">Calendar view coming soon!</p>
            <p className="text-sm text-secondary-500 mt-2">
              Current streak: {stats?.currentStreak || 0} days
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Progress;
