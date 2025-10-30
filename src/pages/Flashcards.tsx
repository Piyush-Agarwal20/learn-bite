import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer, Card, Button, LoadingSpinner } from '../components';
import { getFlashcardsByLessonId, getLessonById } from '../services/api';
import type { Flashcard, Lesson } from '../types';

const Flashcards = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!lessonId) return;

      setLoading(true);
      setError(null);

      const [flashcardsResult, lessonResult] = await Promise.all([
        getFlashcardsByLessonId(lessonId),
        getLessonById(lessonId),
      ]);

      if (flashcardsResult.error) {
        setError('Failed to load flashcards');
        console.error(flashcardsResult.error);
      } else if (flashcardsResult.data) {
        setFlashcards(flashcardsResult.data);
      }

      if (lessonResult.data) {
        setLesson(lessonResult.data);
      }

      setLoading(false);
    }

    fetchData();
  }, [lessonId]);

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
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

  if (flashcards.length === 0) {
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
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">No Flashcards Yet</h2>
              <p className="text-secondary-600 mb-4">
                Flashcards for this lesson haven't been created yet.
              </p>
              <Button onClick={() => navigate(-1)}>Back to Lesson</Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const isLastCard = currentIndex === flashcards.length - 1;
  const isFirstCard = currentIndex === 0;

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-32">
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
            {currentIndex + 1} / {flashcards.length}
          </div>
        </div>

        {/* Lesson Title */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{lesson.title}</h1>
          <p className="text-secondary-600 mt-1">Flashcards</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-primary-600'
                  : index < currentIndex
                  ? 'w-2 bg-primary-400'
                  : 'w-2 bg-secondary-300'
              }`}
            />
          ))}
        </div>

        {/* Flashcard */}
        <div className="min-h-[400px] flex items-center justify-center">
          <Card
            padding="lg"
            className="w-full cursor-pointer select-none transition-all hover:shadow-xl"
            onClick={handleFlip}
          >
            <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-6">
              <div className="text-sm font-medium text-primary-600 mb-4">
                {isFlipped ? 'Answer' : 'Question'}
              </div>
              <p className="text-xl font-medium text-secondary-900 leading-relaxed">
                {isFlipped ? currentCard.back_text : currentCard.front_text}
              </p>
              <div className="mt-8 text-sm text-secondary-500">
                {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
              </div>
            </div>
          </Card>
        </div>

        {/* Controls - Fixed at bottom */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-3">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={isFirstCard}
                className="flex-1"
              >
                ← Previous
              </Button>
              <Button onClick={handleFlip} className="flex-1">
                {isFlipped ? 'Show Question' : 'Show Answer'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleNext}
                disabled={isLastCard}
                className="flex-1"
              >
                Next →
              </Button>
            </div>
            {isLastCard && (
              <Button variant="primary" fullWidth onClick={handleRestart}>
                Restart
              </Button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Flashcards;
