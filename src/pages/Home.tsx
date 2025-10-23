import { Button, Card, ProgressBar, PageContainer } from '../components';

const Home = () => {
  const userName = 'Alex'; // TODO: Get from auth context
  const currentStreak = 7;
  const lessonsCompleted = 24;
  const badgesEarned = 5;

  const recentTopics = [
    { id: 1, title: 'Python Basics', progress: 65, color: 'primary' as const },
    { id: 2, title: 'Marketing 101', progress: 45, color: 'accent' as const },
    { id: 3, title: 'Quantum Physics', progress: 30, color: 'secondary' as const },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="pt-4">
          <h1 className="text-3xl font-bold text-secondary-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-secondary-600 mt-1">Ready for today's lesson?</p>
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

        {/* Today's Lesson CTA */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-secondary-900">Today's Lesson</h2>
              <p className="text-secondary-600 text-sm mt-1">Python Basics • 5 min read</p>
            </div>
            <div className="text-4xl">🐍</div>
          </div>
          <p className="text-secondary-700 mb-4">
            Learn about functions and parameters in Python
          </p>
          <Button variant="primary" size="lg" fullWidth>
            Start Learning →
          </Button>
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

        {/* Continue Learning */}
        <div>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Continue Learning</h2>
          <div className="space-y-3">
            {recentTopics.map((topic) => (
              <Card key={topic.id} hoverable clickable padding="md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-secondary-900">{topic.title}</h3>
                  <span className="text-sm font-medium text-secondary-600">
                    {topic.progress}%
                  </span>
                </div>
                <ProgressBar progress={topic.progress} color={topic.color} size="sm" />
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          <Card hoverable clickable padding="md" className="text-center">
            <div className="text-3xl mb-2">📖</div>
            <p className="font-semibold text-secondary-900">Browse Topics</p>
          </Card>
          <Card hoverable clickable padding="md" className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="font-semibold text-secondary-900">Practice Quiz</p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
