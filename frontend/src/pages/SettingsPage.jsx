import React, { useState } from 'react';
import { Settings, Bell, Globe, Moon, Sun, Volume2, VolumeX, Eye, EyeOff, Save, Check } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';
import { useLanguage } from '../contexts/LanguageContext';

const SettingsPage = () => {
  const { currentLanguage, changeLanguage, LANGUAGES } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    marketUpdates: true,
    weatherAlerts: true,
    communityMessages: true,
    appUpdates: false
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showLocation: false,
    shareData: true
  });
  const [sound, setSound] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [saved, setSaved] = useState(false);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // In a real app, you would save these settings to the backend
    console.log('Settings saved:', {
      darkMode,
      notifications,
      privacy,
      sound,
      fontSize,
      language: currentLanguage.code
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Settings className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>Settings & Preferences</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>Customize your account settings and preferences</TranslatableText>
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-green-600" />
              <TranslatableText>Language Settings</TranslatableText>
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-600 mb-3">
                <TranslatableText>Select your preferred language for the application</TranslatableText>
              </p>
              
              <div className="flex flex-wrap gap-3">
                {Object.values(LANGUAGES).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentLanguage.code === lang.code
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              {darkMode ? (
                <Moon className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <Sun className="w-5 h-5 mr-2 text-green-600" />
              )}
              <TranslatableText>Appearance</TranslatableText>
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    <TranslatableText>Dark Mode</TranslatableText>
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Switch between light and dark theme</TranslatableText>
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="mt-4">
                <p className="font-medium text-gray-800 mb-2">
                  <TranslatableText>Font Size</TranslatableText>
                </p>
                <div className="flex space-x-4">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        fontSize === size
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <TranslatableText>{size.charAt(0).toUpperCase() + size.slice(1)}</TranslatableText>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-green-600" />
              <TranslatableText>Notifications</TranslatableText>
            </h2>
            
            <div className="space-y-4">
              {[
                { id: 'weatherUpdates', label: 'Weather Updates' },
                { id: 'weatherAlerts', label: 'Weather Alerts' },
                { id: 'communityMessages', label: 'Community Messages' },
                { id: 'appUpdates', label: 'App Updates' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <p className="text-gray-800">
                    <TranslatableText>{item.label}</TranslatableText>
                  </p>
                  <button
                    onClick={() => handleNotificationChange(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[item.id] ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[item.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
              
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="font-medium text-gray-800">
                    <TranslatableText>Sound</TranslatableText>
                  </p>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Enable notification sounds</TranslatableText>
                  </p>
                </div>
                <button
                  onClick={() => setSound(!sound)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {sound ? (
                    <Volume2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <VolumeX className="w-6 h-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              {privacy.showProfile ? (
                <Eye className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <EyeOff className="w-5 h-5 mr-2 text-green-600" />
              )}
              <TranslatableText>Privacy</TranslatableText>
            </h2>
            
            <div className="space-y-4">
              {[
                { id: 'showProfile', label: 'Show Profile to Other Users' },
                { id: 'showLocation', label: 'Share Location' },
                { id: 'shareData', label: 'Share Usage Data for Improvements' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <p className="text-gray-800">
                    <TranslatableText>{item.label}</TranslatableText>
                  </p>
                  <button
                    onClick={() => handlePrivacyChange(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy[item.id] ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy[item.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  <TranslatableText>Saved!</TranslatableText>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  <TranslatableText>Save Settings</TranslatableText>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;