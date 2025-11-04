import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchInput, PageContainer, TopicCard, LoadingSpinner } from '../components';
import { getTopics, getTopicCategories } from '../services/api';
import type { Topic } from '../types';

const Topics = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await getTopicCategories();
      if (data) {
        setCategories(data);
      }
    }
    fetchCategories();
  }, []);

  // Fetch topics based on filters
  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getTopics({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        searchQuery: searchQuery || undefined,
      });

      if (fetchError) {
        setError('Failed to load topics. Please try again.');
        console.error(fetchError);
      } else if (data) {
        setTopics(data);
      }

      setLoading(false);
    }

    fetchTopics();
  }, [selectedCategory, searchQuery]);

  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100">Explore Topics</h1>
          <p className="text-secondary-600 theme-text-secondary mt-1">Choose what you want to learn today</p>
        </div>

        {/* Search */}
        <SearchInput
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          fullWidth
        />

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
              style={
                selectedCategory !== category
                  ? {
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                    }
                  : undefined
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-lg text-red-600 theme-text-primary mb-2" style={{ color: '#EF4444' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary-600 hover:text-primary-700 font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Topics Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                icon={topic.icon}
                title={topic.title}
                category={topic.category}
                difficulty={topic.difficulty}
                description={topic.description}
                estimatedTime={topic.estimated_time}
                onClick={() => navigate(`/topics/${topic.id}`)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && topics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-secondary-600 theme-text-secondary dark:text-secondary-400">No topics found</p>
            <p className="text-sm text-secondary-500 theme-text-tertiary mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Topics;
