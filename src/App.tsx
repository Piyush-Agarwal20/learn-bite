import './App.css';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-primary-600">
          Welcome to LearnBite
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl">
          AI-powered micro-learning Progressive Web App
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-8 text-sm text-secondary-500">
          Phase 1: Project Setup Complete! ✓
        </div>
      </div>
    </div>
  );
}

export default App;
