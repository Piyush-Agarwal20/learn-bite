import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, PageContainer } from '../components';

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@example.com');
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');

  const handleLogout = () => {
    // TODO: Implement logout with Supabase
    navigate('/login');
  };

  return (
    <PageContainer>
      <div className="space-y-6 py-4">
        {/* Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
            {name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">{name}</h1>
          <p className="text-secondary-600">{email}</p>
        </div>

        {/* Account Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Button variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-secondary-900">Push Notifications</p>
                <p className="text-sm text-secondary-600">Get notified about your progress</p>
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
                <p className="font-semibold text-secondary-900">Daily Reminder</p>
                <p className="text-sm text-secondary-600">Remind me to learn every day</p>
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

            {dailyReminder && (
              <Input
                label="Reminder Time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                fullWidth
              />
            )}
          </div>
        </Card>

        {/* Learning Preferences */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Learning Preferences</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <p className="font-semibold text-secondary-900">Difficulty Level</p>
              <p className="text-sm text-secondary-600">Intermediate</p>
            </button>
            <button className="w-full text-left p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <p className="font-semibold text-secondary-900">Learning Goals</p>
              <p className="text-sm text-secondary-600">Career Development</p>
            </button>
          </div>
        </Card>

        {/* App Settings */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">App Settings</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <p className="font-semibold text-secondary-900">Offline Content</p>
              <p className="text-sm text-secondary-600">Manage downloaded lessons</p>
            </button>
            <button className="w-full text-left p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
              <p className="font-semibold text-secondary-900">Theme</p>
              <p className="text-sm text-secondary-600">Light Mode</p>
            </button>
          </div>
        </Card>

        {/* Support */}
        <Card padding="lg">
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Support</h2>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-secondary-50 rounded-lg transition-colors">
              <p className="font-semibold text-secondary-900">Help Center</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-secondary-50 rounded-lg transition-colors">
              <p className="font-semibold text-secondary-900">Privacy Policy</p>
            </button>
            <button className="w-full text-left p-3 hover:bg-secondary-50 rounded-lg transition-colors">
              <p className="font-semibold text-secondary-900">Terms of Service</p>
            </button>
          </div>
        </Card>

        {/* Logout Button */}
        <div className="pb-4">
          <Button variant="outline" fullWidth onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
