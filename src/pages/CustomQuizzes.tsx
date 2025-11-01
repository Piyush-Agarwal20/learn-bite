import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Plus, BookOpen, Clock, Trash2, Target } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getUserCustomQuizzes, deleteCustomQuiz, type CustomQuiz } from '../services/api';

const CustomQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<CustomQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    const { data, error } = await getUserCustomQuizzes();
    if (!error && data) {
      setQuizzes(data);
    }
    setLoading(false);
  };

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    const { error } = await deleteCustomQuiz(quizId);
    if (!error) {
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } else {
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-secondary-600 bg-secondary-50';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-secondary-900" />
            </button>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary-500" />
                My AI Quizzes
              </h1>
              <p className="text-sm text-secondary-600">
                {quizzes.length} custom {quizzes.length === 1 ? 'quiz' : 'quizzes'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate('/quiz-generator')}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Quiz
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          </div>
        )}

        {/* Empty State */}
        {!loading && quizzes.length === 0 && (
          <Card padding="lg" className="text-center">
            <Sparkles className="w-16 h-16 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No Custom Quizzes Yet
            </h3>
            <p className="text-secondary-600 mb-6">
              Create your first AI-generated quiz to get started
            </p>
            <Button onClick={() => navigate('/quiz-generator')}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Quiz
            </Button>
          </Card>
        )}

        {/* Quiz List */}
        {!loading && quizzes.length > 0 && (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                padding="lg"
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/custom-quiz/${quiz.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {quiz.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(quiz.level)}`}>
                        <Target className="w-3 h-3 inline mr-1" />
                        {quiz.level}
                      </span>
                      <span className="text-sm text-secondary-600">
                        {quiz.questions.length} questions
                      </span>
                    </div>

                    {quiz.focus_areas && (
                      <p className="text-sm text-secondary-600 mb-2">
                        Focus: {quiz.focus_areas}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <Clock className="w-3 h-3" />
                      Created {formatDate(quiz.created_at)}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(quiz.id);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomQuizzes;
