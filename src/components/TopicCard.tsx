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
        return 'text-green-700 bg-green-50 border-green-200';
      case 'intermediate':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'advanced':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-secondary-600 bg-secondary-50 border-secondary-200';
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

  return (
    <Card hoverable clickable padding="lg" onClick={onClick}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-bold text-lg text-secondary-900 mb-1 truncate">{title}</h3>

          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded border capitalize ${getDifficultyColor(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
            <span className="text-xs text-secondary-500 bg-secondary-50 px-2 py-1 rounded">
              {category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-secondary-600">
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
              <div className="w-full bg-secondary-100 rounded-full h-2 overflow-hidden">
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
