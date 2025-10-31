import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { MainLayout } from './components';
import type { NavItem } from './components';
import { Landing, Login, Signup, Home, Topics, TopicDashboard, Progress, Profile, LessonView, Flashcards, Quiz, Bookmarks } from './pages';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/LoadingSpinner';

// Main App Layout Component
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active nav based on current route
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path === '/topics') return 'topics';
    if (path === '/progress') return 'progress';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const [activeNav, setActiveNav] = useState(getActiveNav());

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/home',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: 'topics',
      label: 'Topics',
      path: '/topics',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: 'progress',
      label: 'Progress',
      path: '/progress',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    const item = navItems.find((nav) => nav.id === id);
    if (item) {
      navigate(item.path);
    }
  };

  return (
    <MainLayout
      showBottomNav={true}
      bottomNav={{
        items: navItems,
        activeItem: activeNav,
        onItemClick: handleNavClick,
      }}
    >
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/:topicId" element={<TopicDashboard />} />
        <Route path="/topics/:topicId/lessons/:lessonId" element={<LessonView />} />
        <Route path="/lesson/:topicId/:lessonId" element={<LessonView />} />
        <Route path="/flashcards/:lessonId" element={<Flashcards />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </MainLayout>
  );
}

// Protected App Layout
function ProtectedAppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

// Main App Component with Router
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<ProtectedAppLayout />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
