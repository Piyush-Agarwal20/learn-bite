import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, PageContainer, LoadingSpinner } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { useThemeStore } from '../stores/themeStore';
import { getUserStats } from '../services/api/progress';
import { getProfile, updateProfile, type Profile as ProfileType } from '../services/api';
import type { UserStats } from '../types';
import { User, Mail, Bell, Book, Award, LogOut, Edit2, Check, X, Bookmark } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [profileResult, statsResult] = await Promise.all([
        getProfile(),
        getUserStats(),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
        setEditedName(profileResult.data.full_name || '');
      }

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const handleSaveName = async () => {
    if (!editedName.trim()) return;

    setSaving(true);
    const { data, error } = await updateProfile({ full_name: editedName.trim() });

    if (!error && data) {
      setProfile(data);
      setIsEditingName(false);
    } else {
      alert('Failed to update name. Please try again.');
    }

    setSaving(false);
  };

  const handleCancelEdit = () => {
    setEditedName(profile?.full_name || '');
    setIsEditingName(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
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

  const displayName = profile?.full_name || 'User';
  const email = profile?.email || user?.email || '';
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <PageContainer>
      <div className="space-y-6 py-4 pb-24">
        {/* Header with Avatar */}
        <div className="text-left">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mb-4 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>

          {/* Editable Name */}
          {isEditingName ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left border-2 border-primary-500 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
                disabled={saving}
              />
              <button
                onClick={handleSaveName}
                disabled={saving || !editedName.trim()}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100">{displayName}</h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit name"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}

          <p className="text-secondary-600 theme-text-secondary flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {email}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card padding="md" variant="elevated" className="text-left">
            <Book className="w-8 h-8 text-primary-600 mb-2" />
            <p className="text-2xl font-bold text-primary-600">{stats?.completedLessons || 0}</p>
            <p className="text-xs text-secondary-600 theme-text-secondary mt-1">Lessons</p>
          </Card>
          <Card padding="md" variant="elevated" className="text-left">
            <Award className="w-8 h-8 text-accent-600 mb-2" />
            <p className="text-2xl font-bold text-accent-600">{stats?.currentStreak || 0}</p>
            <p className="text-xs text-secondary-600 theme-text-secondary mt-1">Day Streak</p>
          </Card>
          <Card padding="md" variant="elevated" className="text-left">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-2xl font-bold text-secondary-600 theme-text-secondary dark:text-secondary-400">{stats?.progressPercentage || 0}%</p>
            <p className="text-xs text-secondary-600 theme-text-secondary mt-1">Progress</p>
          </Card>
        </div>

        {/* Account Info */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </h2>
          <div className="space-y-3 text-left">
            {/* Editable Full Name */}
            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="text-sm text-secondary-600 theme-text-secondary text-left mb-1">Full Name</p>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 bg-white border-2 border-primary-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                    disabled={saving}
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving || !editedName.trim()}
                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">{displayName}</p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-2 text-primary-600 hover:bg-white rounded-lg transition-colors"
                    title="Edit name"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="text-sm text-secondary-600 theme-text-secondary text-left">Email</p>
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">{email}</p>
            </div>
            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="text-sm text-secondary-600 theme-text-secondary text-left">Member Since</p>
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">{memberSince}</p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100">Push Notifications</p>
                <p className="text-sm text-secondary-600 theme-text-secondary dark:text-secondary-400">Get notified about your progress</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-primary-500' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100">Daily Reminder</p>
                <p className="text-sm text-secondary-600 theme-text-secondary dark:text-secondary-400">Remind me to learn every day</p>
              </div>
              <button
                onClick={() => setDailyReminder(!dailyReminder)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  dailyReminder ? 'bg-primary-500' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    dailyReminder ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 mb-4 text-left">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/bookmarks')}
              className="p-4 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg hover:bg-secondary-100 dark:bg-secondary-700 transition-colors text-left"
            >
              <Bookmark className="w-6 h-6 text-yellow-600 mb-2" />
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-sm">Bookmarks</p>
              <p className="text-xs text-secondary-600 theme-text-secondary mt-1">View saved lessons</p>
            </button>
            <button
              onClick={() => navigate('/topics')}
              className="p-4 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg hover:bg-secondary-100 dark:bg-secondary-700 transition-colors text-left"
            >
              <Book className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-sm">Browse Topics</p>
              <p className="text-xs text-secondary-600 theme-text-secondary mt-1">Explore courses</p>
            </button>
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 mb-4 text-left">Learning Preferences</h2>
          <div className="space-y-3 text-left">
            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">Difficulty Level</p>
              <p className="text-sm text-secondary-600 theme-text-secondary text-left">Intermediate</p>
            </div>
            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">Learning Goals</p>
              <p className="text-sm text-secondary-600 theme-text-secondary text-left">Career Development</p>
            </div>
          </div>
        </Card>

        {/* App Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 theme-text-primary dark:text-secondary-100 mb-4 text-left">App Settings</h2>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100">Theme</p>
                <p className="text-sm text-secondary-600 theme-text-secondary dark:text-secondary-400">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-primary-500' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-secondary-50 dark:bg-secondary-800 dark:bg-secondary-800 rounded-lg text-left">
              <p className="font-semibold text-secondary-900 theme-text-primary dark:text-secondary-100 text-left">Language</p>
              <p className="text-sm text-secondary-600 theme-text-secondary text-left">English</p>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <div className="pb-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
