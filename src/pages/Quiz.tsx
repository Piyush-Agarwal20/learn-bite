import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button, LoadingSpinner } from '../components';
import { getQuizzesByLessonId, getLessonById } from '../services/api';
import type { Quiz, Lesson } from '../types';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';

const QuizPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!lessonId) return;

      setLoading(true);
      setError(null);

      const [quizzesResult, lessonResult] = await Promise.all([
        getQuizzesByLessonId(lessonId),
        getLessonById(lessonId),
      ]);

      if (quizzesResult.error) {
        setError('Failed to load quiz');
        console.error(quizzesResult.error);
      } else if (quizzesResult.data) {
        setQuizzes(quizzesResult.data);
        setAnswers(new Array(quizzesResult.data.length).fill(null));
      }

      if (lessonResult.data) {
        setLesson(lessonResult.data);
      }

      setLoading(false);
    }

    fetchData();
  }, [lessonId]);

  const currentQuiz = quizzes[currentIndex];
  const isLastQuestion = currentIndex === quizzes.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return; // Don't allow changing after submission
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers(new Array(quizzes.length).fill(null));
    setShowSummary(false);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizzes[index].correct_answer) {
        correct++;
      }
    });
    return { correct, total: quizzes.length, percentage: Math.round((correct / quizzes.length) * 100) };
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !lesson) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg text-red-600 mb-4">{error || 'Lesson not found'}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </PageContainer>
    );
  }

  if (quizzes.length === 0) {
    return (
      <PageContainer>
        <div className="space-y-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <Card padding="lg">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">No Quiz Available</h2>
              <p className="text-secondary-600 mb-4">
                Quiz questions for this lesson haven't been created yet.
              </p>
              <Button onClick={() => navigate(-1)}>Back to Lesson</Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  // Summary View
  if (showSummary) {
    const score = calculateScore();
    const passed = score.percentage >= 70;

    return (
      <PageContainer>
        <div className="space-y-6 py-4 pb-32">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          {/* Results Card */}
          <Card padding="lg" variant="elevated" className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {passed ? (
                <Award className="w-12 h-12 text-green-600" />
              ) : (
                <RotateCcw className="w-12 h-12 text-orange-600" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              {passed ? 'Great Job!' : 'Keep Practicing!'}
            </h2>
            <p className="text-secondary-600 mb-6">
              {passed
                ? 'You passed the quiz! Well done!'
                : 'You can review the lesson and try again.'}
            </p>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 mb-6">
              <div className="text-6xl font-bold text-primary-600 mb-2">
                {score.percentage}%
              </div>
              <p className="text-lg text-secondary-700">
                {score.correct} out of {score.total} correct
              </p>
            </div>

            {/* Question Review */}
            <div className="text-left space-y-3 mb-6">
              <h3 className="font-bold text-secondary-900 text-center mb-4">Question Review</h3>
              {quizzes.map((quiz, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === quiz.correct_answer;

                return (
                  <div
                    key={quiz.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <span className="text-sm text-secondary-900 flex-1">
                      Question {index + 1}
                    </span>
                    <span className={`text-xs font-medium ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
            <div className="max-w-4xl mx-auto flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Back to Lesson
              </Button>
              <Button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Quiz View
  const isAnswerCorrect = selectedAnswer === currentQuiz.correct_answer;
  const options = currentQuiz.options as string[];

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-40">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
          <div className="text-sm font-medium text-secondary-600">
            Question {currentIndex + 1} / {quizzes.length}
          </div>
        </div>

        {/* Lesson Title */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{lesson.title}</h1>
          <p className="text-secondary-600 mt-1">Quiz</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card padding="lg" variant="elevated">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold mb-4">
              {currentIndex + 1}
            </div>
            <h2 className="text-xl font-bold text-secondary-900 leading-relaxed">
              {currentQuiz.question_text}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuiz.correct_answer;
              const showCorrect = showResult && isCorrectAnswer;
              const showWrong = showResult && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-500 bg-green-50'
                      : showWrong
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-50'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium ${
                      showCorrect
                        ? 'border-green-500 bg-green-500 text-white'
                        : showWrong
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-secondary-300 text-secondary-600'
                    }`}>
                      {showCorrect ? <CheckCircle className="w-5 h-5" /> :
                       showWrong ? <XCircle className="w-5 h-5" /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className={`flex-1 ${
                      showCorrect || showWrong ? 'font-medium' : ''
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && currentQuiz.explanation && (
            <div className={`mt-6 p-4 rounded-lg ${
              isAnswerCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-blue-500'
            }`}>
              <h3 className={`font-bold mb-2 ${
                isAnswerCorrect ? 'text-green-900' : 'text-blue-900'
              }`}>
                {isAnswerCorrect ? '✨ Correct!' : '💡 Explanation'}
              </h3>
              <p className={isAnswerCorrect ? 'text-green-800' : 'text-blue-800'}>
                {currentQuiz.explanation}
              </p>
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto">
            {!showResult ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                fullWidth
                className="flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} fullWidth>
                {isLastQuestion ? 'View Results' : 'Next Question →'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default QuizPage;
