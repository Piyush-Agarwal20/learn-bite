import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import { getLessonById } from '../services/api/lessons';
import { markLessonComplete } from '../services/api/progress';
import type { Lesson } from '../types';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

const LessonView = () => {
  const { topicId, lessonId } = useParams<{ topicId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [showSimpleExplanation, setShowSimpleExplanation] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId) return;

      setLoading(true);
      const { data, error } = await getLessonById(lessonId);

      if (!error && data) {
        setLesson(data);
      }
      setLoading(false);
    }

    fetchLesson();
  }, [lessonId]);

  const handleComplete = async () => {
    if (!lessonId) return;

    setCompleting(true);
    const { error } = await markLessonComplete(lessonId);

    if (error) {
      console.error('Error marking lesson complete:', error);
      alert('Failed to mark lesson as complete. Please try again.');
      setCompleting(false);
      return;
    }

    // Show success and navigate back
    setCompleting(false);
    if (topicId) {
      navigate(`/topics/${topicId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lesson Not Found</h2>
        <p className="text-gray-600 mb-6">This lesson doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/topics/${topicId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.estimated_time || lesson.estimated_read_time} min</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>Lesson {lesson.order_index || lesson.order}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-40">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {lesson.title}
        </h1>

        {/* ELI5 Toggle */}
        <button
          onClick={() => setShowSimpleExplanation(!showSimpleExplanation)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-6 transition-colors ${
            showSimpleExplanation
              ? 'bg-accent text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="font-medium">
            {showSimpleExplanation ? 'Regular Explanation' : 'Explain Like I\'m 5'}
          </span>
        </button>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {showSimpleExplanation ? (
            <div className="prose prose-lg max-w-none">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-6">
                <h3 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Simple Explanation
                </h3>
                <div className="text-amber-800 leading-relaxed">
                  {lesson.content_eli5 || 'Simple explanation not available yet. This feature will generate easy-to-understand explanations using AI.'}
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {lesson.content || 'Lesson content will be displayed here. This can include text, code examples, and multimedia content.'}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {lesson.content && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Takeaways</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    This lesson covers the fundamentals of {lesson.title.toLowerCase()}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Practice these concepts to build mastery
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">
                    Apply this knowledge in real-world scenarios
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 mb-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/topics/${topicId}`)}
              className="flex-1"
              disabled={completing}
            >
              Back to Topic
            </Button>
            <Button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-2"
              loading={completing}
              disabled={completing}
            >
              <CheckCircle className="w-5 h-5" />
              {completing ? 'Completing...' : 'Complete Lesson'}
            </Button>
          </div>
          <Button
            variant="accent"
            onClick={() => navigate(`/flashcards/${lessonId}`)}
            className="w-full"
            disabled={completing}
          >
            📚 Practice with Flashcards
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
