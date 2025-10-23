import { useState } from 'react';
import { Card, SearchInput, PageContainer } from '../components';

interface Topic {
  id: number;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  time: string;
  icon: string;
}

const Topics = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Business', 'Technology', 'Science', 'Arts', 'Languages'];

  const allTopics: Topic[] = [
    {
      id: 1,
      title: 'Python Programming',
      category: 'Technology',
      difficulty: 'Beginner',
      lessons: 24,
      time: '3 weeks',
      icon: '🐍',
    },
    {
      id: 2,
      title: 'Digital Marketing',
      category: 'Business',
      difficulty: 'Beginner',
      lessons: 18,
      time: '2 weeks',
      icon: '📱',
    },
    {
      id: 3,
      title: 'Quantum Physics',
      category: 'Science',
      difficulty: 'Advanced',
      lessons: 32,
      time: '5 weeks',
      icon: '⚛️',
    },
    {
      id: 4,
      title: 'UI/UX Design',
      category: 'Technology',
      difficulty: 'Intermediate',
      lessons: 20,
      time: '3 weeks',
      icon: '🎨',
    },
    {
      id: 5,
      title: 'Spanish Basics',
      category: 'Languages',
      difficulty: 'Beginner',
      lessons: 15,
      time: '2 weeks',
      icon: '🇪🇸',
    },
    {
      id: 6,
      title: 'Psychology 101',
      category: 'Science',
      difficulty: 'Beginner',
      lessons: 22,
      time: '3 weeks',
      icon: '🧠',
    },
  ];

  const filteredTopics = allTopics.filter((topic) => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-accent-600 bg-accent-50';
      case 'Intermediate':
        return 'text-primary-600 bg-primary-50';
      case 'Advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-secondary-600 bg-secondary-50';
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Explore Topics</h1>
          <p className="text-secondary-600 mt-1">Choose what you want to learn today</p>
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
            >
              {category}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} hoverable clickable padding="lg">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{topic.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-secondary-900 mb-1">{topic.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${getDifficultyColor(
                        topic.difficulty
                      )}`}
                    >
                      {topic.difficulty}
                    </span>
                    <span className="text-xs text-secondary-500">{topic.category}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary-600">
                    <span>📚 {topic.lessons} lessons</span>
                    <span>⏱️ {topic.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-secondary-600">No topics found</p>
            <p className="text-sm text-secondary-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Topics;
