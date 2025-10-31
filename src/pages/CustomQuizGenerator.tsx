import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BookOpen, Target, Hash } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { createCustomQuiz } from '../services/api';

const CustomQuizGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    focusAreas: '',
    numberOfQuestions: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await createCustomQuiz(formData);

      if (error) {
        console.error('Error generating quiz:', error);
        alert('Failed to generate quiz. Please try again.');
        return;
      }

      if (data) {
        // Navigate to the quiz page
        navigate(`/custom-quiz/${data.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-secondary-900 dark:text-secondary-100" />
          </button>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-500" />
              AI Quiz Generator
            </h1>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Create custom quizzes powered by AI
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="text-left">
              <label className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                <BookOpen className="w-4 h-4 text-primary-500" />
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., React Hooks, Python Basics, Machine Learning"
                className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Level Selection */}
            <div className="text-left">
              <label className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                <Target className="w-4 h-4 text-primary-500" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, level })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.level === level
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div className="text-left">
              <label className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2 block">
                Focus Areas (Optional)
              </label>
              <textarea
                value={formData.focusAreas}
                onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                placeholder="e.g., useState, useEffect, custom hooks"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Specify particular aspects you want the quiz to focus on
              </p>
            </div>

            {/* Number of Questions */}
            <div className="text-left">
              <label className="flex items-center gap-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                <Hash className="w-4 h-4 text-primary-500" />
                Number of Questions: {formData.numberOfQuestions}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={formData.numberOfQuestions}
                onChange={(e) => setFormData({ ...formData, numberOfQuestions: parseInt(e.target.value) })}
                className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                <span>3 questions</span>
                <span>10 questions</span>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              type="submit"
              disabled={isGenerating || !formData.topic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>

            {isGenerating && (
              <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                AI is creating your custom quiz. This may take a moment...
              </p>
            )}
          </form>
        </Card>

        {/* Info Card */}
        <Card padding="md" className="mt-4">
          <div className="text-left">
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              How it works
            </h3>
            <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
              <li>• AI generates unique questions based on your preferences</li>
              <li>• Each quiz is saved to your profile for later access</li>
              <li>• Questions include detailed explanations</li>
              <li>• Take the quiz as many times as you want</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomQuizGenerator;
