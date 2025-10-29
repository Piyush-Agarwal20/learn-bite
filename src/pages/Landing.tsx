import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { Button } from '../components';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">LearnBite</h1>
          <p className="text-2xl text-gray-700 mb-8">
            Learn Anything, Anytime - One Bite at a Time
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Bite-sized lessons, personalized learning paths, and AI-powered content
            to help you master any topic in minutes a day.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Micro-Learning</h3>
            <p className="text-gray-600">
              Learn in 5-minute sessions that fit your busy schedule
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Get personalized explanations and adaptive learning paths
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="text-5xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Stay Motivated</h3>
            <p className="text-gray-600">
              Track streaks, earn achievements, and build lasting habits
            </p>
          </div>
        </div>

        {/* Topics Preview */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Would You Like to Learn?
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {['Python', 'JavaScript', 'Data Science', 'Marketing', 'Design', 'Spanish', 'Physics', 'Psychology'].map((topic) => (
              <span
                key={topic}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Start Learning Today
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of learners who are achieving their goals with LearnBite
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
