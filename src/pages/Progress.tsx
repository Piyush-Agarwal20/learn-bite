import { useState, useEffect } from 'react';
import { Card, ProgressBar, PageContainer, LoadingSpinner } from '../components';
import { getUserStats, getAllTopicsProgress, getWeeklyActivity } from '../services/api';
import type { UserStats } from '../types';

interface TopicProgress {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

interface WeeklyActivity {
  day: string;
  lessons: number;
  date: string;
}

const Progress = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [topicsProgress, setTopicsProgress] = useState<TopicProgress[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [statsResult, topicsResult, weeklyResult] = await Promise.all([
        getUserStats(),
        getAllTopicsProgress(),
        getWeeklyActivity(),
      ]);

      if (!statsResult.error && statsResult.data) {
        setStats(statsResult.data);
      }

      if (!topicsResult.error && topicsResult.data) {
        setTopicsProgress(topicsResult.data);
      }

      if (!weeklyResult.error && weeklyResult.data) {
        setWeeklyActivity(weeklyResult.data);
      }

      setLoading(false);
    }

    fetchData();
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

  const maxLessons = weeklyActivity.length > 0
    ? Math.max(...weeklyActivity.map((d) => d.lessons), 1)
    : 1;

  const getColorForIndex = (index: number) => {
    const colors = ['primary', 'accent', 'secondary'] as const;
    return colors[index % colors.length];
  };

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-24">
        {/* Header */}
        <div className="text-left">
          <h1 className="text-3xl font-bold text-secondary-900">Your Progress</h1>
          <p className="text-secondary-600 mt-1">Track your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card padding="md" variant="elevated" className="text-left">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-2xl font-bold text-primary-600">{stats?.completedLessons || 0}</p>
            <p className="text-xs text-secondary-600 mt-1">Lessons Completed</p>
          </Card>

          <Card padding="md" variant="elevated" className="text-left">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-2xl font-bold text-accent-600">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-secondary-600 mt-1">Current Streak</p>
          </Card>

          <Card padding="md" variant="elevated" className="text-left">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-2xl font-bold text-secondary-600">{stats?.progressPercentage || 0}%</p>
            <p className="text-xs text-secondary-600 mt-1">Overall Progress</p>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4 text-left">This Week</h2>
          {weeklyActivity.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyActivity.map((day) => (
                <div key={day.date} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary-500 rounded-t transition-all hover:bg-primary-600"
                    style={{
                      height: `${(day.lessons / maxLessons) * 100}%`,
                      minHeight: day.lessons > 0 ? '20px' : '4px',
                    }}
                  />
                  <p className="text-xs text-secondary-600 mt-2">{day.day}</p>
                  <p className="text-xs text-secondary-400">{day.lessons}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-left py-8">
              <p className="text-secondary-600">No activity recorded this week yet.</p>
              <p className="text-sm text-secondary-500 mt-2">
                Complete lessons to see your weekly progress!
              </p>
            </div>
          )}
        </Card>

        {/* Topic Progress */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4 text-left">Course Progress</h2>
          {topicsProgress.length > 0 ? (
            <div className="space-y-4 text-left">
              {topicsProgress.map((topic, index) => (
                <div key={topic.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-left">
                      <span className="font-semibold text-secondary-900 block">{topic.title}</span>
                      <span className="text-xs text-secondary-500">{topic.category}</span>
                    </div>
                    <span className="text-sm text-secondary-600">
                      {topic.completedLessons}/{topic.totalLessons}
                    </span>
                  </div>
                  <ProgressBar progress={topic.progress} color={getColorForIndex(index)} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-left py-4">
              <p className="text-secondary-600">No topics available yet.</p>
              <p className="text-sm text-secondary-500 mt-2">
                Start exploring topics to track your progress!
              </p>
            </div>
          )}
        </Card>

        {/* Achievements Section */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4 text-left">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            {stats && stats.completedLessons >= 1 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">🎯</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  First Lesson
                </p>
                <p className="text-xs text-secondary-500 mt-1">Complete 1 lesson</p>
              </div>
            )}
            {stats && stats.completedLessons >= 5 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">⚡</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  Quick Learner
                </p>
                <p className="text-xs text-secondary-500 mt-1">Complete 5 lessons</p>
              </div>
            )}
            {stats && stats.currentStreak >= 3 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">🔥</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  3 Day Streak
                </p>
                <p className="text-xs text-secondary-500 mt-1">Learn 3 days in a row</p>
              </div>
            )}
            {stats && stats.currentStreak >= 7 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">💪</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  Week Warrior
                </p>
                <p className="text-xs text-secondary-500 mt-1">7 day streak!</p>
              </div>
            )}
            {stats && stats.completedLessons >= 10 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">🏆</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  Dedicated
                </p>
                <p className="text-xs text-secondary-500 mt-1">Complete 10 lessons</p>
              </div>
            )}
            {stats && stats.progressPercentage >= 50 && (
              <div className="flex flex-col items-center p-4 bg-secondary-50 rounded-lg">
                <div className="text-4xl mb-2">🌟</div>
                <p className="font-semibold text-sm text-secondary-900 text-center">
                  Halfway There
                </p>
                <p className="text-xs text-secondary-500 mt-1">50% progress</p>
              </div>
            )}
          </div>
          {(!stats || stats.completedLessons === 0) && (
            <div className="text-left py-8">
              <p className="text-secondary-600">Start completing lessons to unlock achievements!</p>
            </div>
          )}
        </Card>

        {/* Learning Insights */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4 text-left">Learning Insights</h2>
          <div className="space-y-3 text-left">
            <div className="p-3 bg-secondary-50 rounded-lg text-left">
              <p className="text-sm text-secondary-600 text-left">Total Lessons</p>
              <p className="font-semibold text-secondary-900 text-left text-lg">
                {stats?.totalLessons || 0}
              </p>
            </div>
            <div className="p-3 bg-secondary-50 rounded-lg text-left">
              <p className="text-sm text-secondary-600 text-left">Remaining Lessons</p>
              <p className="font-semibold text-secondary-900 text-left text-lg">
                {(stats?.totalLessons || 0) - (stats?.completedLessons || 0)}
              </p>
            </div>
            {stats && stats.completedLessons > 0 && (
              <div className="p-3 bg-primary-50 rounded-lg text-left border-l-4 border-primary-500">
                <p className="text-sm text-primary-700 text-left font-medium">
                  Keep up the great work! 🎉
                </p>
                <p className="text-xs text-primary-600 text-left mt-1">
                  You've completed {stats.completedLessons} lesson{stats.completedLessons !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Progress;
