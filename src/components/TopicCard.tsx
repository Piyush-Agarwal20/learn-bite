import Card from './Card';

interface TopicCardProps {
  icon: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  estimatedTime: number; // in minutes
  totalLessons?: number;
  completedLessons?: number;
  onClick?: () => void;
}

const TopicCard = ({
  icon,
  title,
  category,
  difficulty,
  description,
  estimatedTime,
  totalLessons,
  completedLessons,
  onClick,
}: TopicCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'beginner':
        return {
          className: 'text-green-700 bg-green-50 border-green-200',
          darkStyle: { backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', borderColor: 'rgba(34, 197, 94, 0.3)' }
        };
      case 'intermediate':
        return {
          className: 'text-blue-700 bg-blue-50 border-blue-200',
          darkStyle: { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA', borderColor: 'rgba(59, 130, 246, 0.3)' }
        };
      case 'advanced':
        return {
          className: 'text-red-700 bg-red-50 border-red-200',
          darkStyle: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }
        };
      default:
        return {
          className: 'text-secondary-600 bg-secondary-50 border-secondary-200',
          darkStyle: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }
        };
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const progressPercentage =
    totalLessons && completedLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const difficultyColors = getDifficultyColor(difficulty);

  return (
    <Card hoverable clickable padding="lg" onClick={onClick}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-bold text-lg mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{title}</h3>

          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border capitalize ${difficultyColors.className}`}
              style={difficultyColors.darkStyle}
            >
              {difficulty}
            </span>
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}
            >
              {category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400 dark:text-secondary-500">
            {totalLessons !== undefined && (
              <span className="flex items-center gap-1">
                <span>📚</span>
                <span>
                  {completedLessons || 0}/{totalLessons} lessons
                </span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{formatTime(estimatedTime)}</span>
            </span>
          </div>

          {/* Progress Bar (if lessons exist) */}
          {totalLessons !== undefined && totalLessons > 0 && (
            <div className="mt-3">
              <div className="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {progressPercentage > 0 && (
                <p className="text-xs text-secondary-500 mt-1">{progressPercentage}% complete</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TopicCard;
