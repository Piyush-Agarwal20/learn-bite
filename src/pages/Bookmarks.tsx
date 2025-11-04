import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageContainer, LoadingSpinner } from '../components';
import { getUserBookmarks, removeBookmark } from '../services/api';
import { Bookmark as BookmarkIcon, Clock, Trash2 } from 'lucide-react';

interface BookmarkedLesson {
  id: string;
  lesson_id: string;
  created_at: string;
  lessons: {
    id: string;
    title: string;
    estimated_read_time: number;
    topics: {
      id: string;
      title: string;
      icon: string;
    };
  };
}

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarks() {
      setLoading(true);
      const { data, error } = await getUserBookmarks();

      if (!error && data) {
        setBookmarks(data as BookmarkedLesson[]);
      }
      setLoading(false);
    }

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (lessonId: string, bookmarkId: string) => {
    setRemovingId(bookmarkId);
    const { error } = await removeBookmark(lessonId);

    if (!error) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    }
    setRemovingId(null);
  };

  const handleLessonClick = (topicId: string, lessonId: string) => {
    navigate(`/topics/${topicId}/lessons/${lessonId}`);
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

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-24">
        {/* Header */}
        <div className="text-left">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-7 h-7 text-yellow-600" />
            <h1 className="text-3xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100">Bookmarks</h1>
          </div>
          <p className="text-secondary-600 theme-text-secondary mt-1">Your saved lessons for later</p>
        </div>

        {/* Bookmarks List */}
        {bookmarks.length > 0 ? (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} padding="md" hoverable>
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{bookmark.lessons.topics.icon}</div>
                  <div className="flex-1 text-left min-w-0">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleLessonClick(bookmark.lessons.topics.id, bookmark.lessons.id)}
                    >
                      <p className="text-xs text-primary-600 font-medium">
                        {bookmark.lessons.topics.title}
                      </p>
                      <h3 className="text-lg font-bold text-secondary-900 theme-text-primary mt-1 hover:text-primary-600 transition-colors">
                        {bookmark.lessons.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-secondary-600 theme-text-secondary flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {bookmark.lessons.estimated_read_time} min
                        </span>
                        <span className="text-xs text-secondary-500 theme-text-tertiary dark:text-secondary-400">
                          Saved {new Date(bookmark.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.lesson_id, bookmark.id)}
                    disabled={removingId === bookmark.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg">
            <div className="text-center py-12">
              <BookmarkIcon className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary-900 theme-text-primary mb-2">No Bookmarks Yet</h3>
              <p className="text-secondary-600 theme-text-secondary mb-6">
                Save lessons you want to revisit later by clicking the bookmark icon
              </p>
              <button
                onClick={() => navigate('/topics')}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
              >
                Browse Topics
              </button>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default Bookmarks;
