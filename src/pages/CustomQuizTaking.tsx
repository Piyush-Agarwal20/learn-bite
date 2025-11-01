import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { getCustomQuizById, type CustomQuiz } from '../services/api';
import { type GeneratedQuestion } from '../services/openai';

const CustomQuizTaking = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<CustomQuiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    if (!quizId) return;

    setLoading(true);
    const { data, error } = await getCustomQuizById(quizId);

    if (error || !data) {
      alert('Failed to load quiz');
      navigate('/custom-quizzes');
      return;
    }

    setQuiz(data);
    setSelectedAnswers(new Array(data.questions.length).fill(-1));
    setLoading(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResults) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!quiz) return;

    // Check if all questions are answered
    if (selectedAnswers.includes(-1)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);
    setCurrentQuestion(0); // Reset to first question to show review
  };

  const handleRetake = () => {
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setShowResults(false);
    setCurrentQuestion(0);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQ: GeneratedQuestion = quiz.questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== -1;
  const isCorrect = showResults && selectedAnswers[currentQuestion] === currentQ.correctAnswer;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/custom-quizzes')}
            className="p-2 rounded-lg hover:bg-secondary-100 active:bg-secondary-200 transition-colors touch-manipulation flex-shrink-0"
            aria-label="Back to quizzes"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-900" />
          </button>
          <div className="text-left flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-secondary-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 flex-shrink-0" />
              <span className="truncate">{quiz.title}</span>
            </h1>
            <p className="text-xs sm:text-sm text-secondary-600">
              {showResults ? 'Review Your Answers' : `Question ${currentQuestion + 1} of ${quiz.questions.length}`}
            </p>
          </div>
        </div>

        {/* Results Summary */}
        {showResults && (
          <Card padding="lg" className="mb-4 sm:mb-6">
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold mb-2 ${
                score / quiz.questions.length >= 0.7 ? 'text-green-600' :
                score / quiz.questions.length >= 0.5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {score}/{quiz.questions.length}
              </div>
              <p className="text-base sm:text-lg text-secondary-900 mb-1">
                {score / quiz.questions.length >= 0.7 ? 'Great job!' :
                 score / quiz.questions.length >= 0.5 ? 'Good effort!' :
                 'Keep practicing!'}
              </p>
              <p className="text-xs sm:text-sm text-secondary-600 mb-4">
                {Math.round((score / quiz.questions.length) * 100)}% correct
              </p>
              <Button onClick={handleRetake} className="mx-auto touch-manipulation">
                Retake Quiz
              </Button>
            </div>
          </Card>
        )}

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-1">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  showResults
                    ? selectedAnswers[index] === quiz.questions[index].correctAnswer
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : index === currentQuestion
                    ? 'bg-primary-500'
                    : selectedAnswers[index] !== -1
                    ? 'bg-primary-300 dark:bg-primary-700'
                    : 'bg-secondary-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <Card padding="lg" className="mb-4 sm:mb-6">
          <div className="text-left mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
              <span className="text-xs sm:text-sm font-semibold text-primary-600">
                Question {currentQuestion + 1}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-secondary-900">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === index;
              const isCorrectAnswer = index === currentQ.correctAnswer;

              let optionStyle = 'border-secondary-300 bg-white hover:border-primary-300 dark:hover:border-primary-700';

              if (showResults) {
                if (isCorrectAnswer) {
                  optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'border-red-500 bg-red-50';
                }
              } else if (isSelected) {
                optionStyle = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResults}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all touch-manipulation ${optionStyle} ${
                    showResults ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base text-secondary-900 flex-1">
                      {option}
                    </span>
                    {showResults && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {showResults && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (shown in results mode) */}
          {showResults && (
            <div className={`p-3 sm:p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-50 border-l-4 border-green-500'
                : 'bg-red-50 border-l-4 border-red-500'
            }`}>
              <p className="font-semibold text-sm sm:text-base text-secondary-900 mb-1 text-left">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-xs sm:text-sm text-secondary-700 text-left">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex gap-2 sm:gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="secondary"
            className="flex-1 touch-manipulation"
          >
            <span className="text-sm sm:text-base">Previous</span>
          </Button>

          {!showResults && currentQuestion === quiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isAnswered}
              className="flex-1 touch-manipulation"
            >
              <span className="text-sm sm:text-base">Submit Quiz</span>
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestion === quiz.questions.length - 1}
              className="flex-1 touch-manipulation"
            >
              <span className="text-sm sm:text-base">Next</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomQuizTaking;
