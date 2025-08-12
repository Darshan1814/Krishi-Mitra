import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Save, X, Shield, Key, Bell, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import TranslatableText from '../components/TranslatableText';

const ProfilePage = () => {
  const { user } = useAuth();
  const { currentLanguage, changeLanguage, LANGUAGES } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'User Name',
    email: user?.email || 'user@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address?.village || 'Village',
    district: user?.address?.district || 'District',
    state: user?.address?.state || 'State',
    pincode: user?.address?.pincode || '123456',
    dateOfBirth: user?.dateOfBirth || '1990-01-01',
    bio: user?.bio || 'Farmer with 10+ years of experience in organic farming.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Updated profile:', formData);
    setIsEditing(false);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>Full Name</TranslatableText>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>Email</TranslatableText>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>Phone Number</TranslatableText>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>Date of Birth</TranslatableText>
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>Village/Address</TranslatableText>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>District</TranslatableText>
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>State</TranslatableText>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                <TranslatableText>PIN Code</TranslatableText>
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Bio</TranslatableText>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              <TranslatableText>Cancel</TranslatableText>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <TranslatableText>Save Changes</TranslatableText>
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              <TranslatableText>Personal Information</TranslatableText>
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-green-600 hover:text-green-700"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              <TranslatableText>Edit</TranslatableText>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Full Name</TranslatableText>
                  </p>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Email</TranslatableText>
                  </p>
                  <p className="font-medium">{formData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Phone</TranslatableText>
                  </p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Date of Birth</TranslatableText>
                  </p>
                  <p className="font-medium">{formData.dateOfBirth}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    <TranslatableText>Address</TranslatableText>
                  </p>
                  <p className="font-medium">{formData.address}, {formData.district}</p>
                  <p className="font-medium">{formData.state} - {formData.pincode}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              <TranslatableText>Bio</TranslatableText>
            </p>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{formData.bio}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        <TranslatableText>Preferences</TranslatableText>
      </h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 text-green-600 mr-2" />
          <TranslatableText>Language Preferences</TranslatableText>
        </h3>
        
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
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Bell className="w-5 h-5 text-green-600 mr-2" />
          <TranslatableText>Notification Preferences</TranslatableText>
        </h3>
        
        <div className="space-y-4">
          {[
            { id: 'email_notif', label: 'Email Notifications', checked: true },
            { id: 'sms_notif', label: 'SMS Notifications', checked: false },
            { id: 'app_notif', label: 'App Notifications', checked: true },
            { id: 'weather_alerts', label: 'Weather Alerts', checked: true },
            { id: 'weather_updates', label: 'Weather Updates', checked: true }
          ].map((pref) => (
            <div key={pref.id} className="flex items-center">
              <input
                type="checkbox"
                id={pref.id}
                defaultChecked={pref.checked}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor={pref.id} className="ml-2 text-gray-700">
                <TranslatableText>{pref.label}</TranslatableText>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        <TranslatableText>Security Settings</TranslatableText>
      </h2>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Key className="w-5 h-5 text-green-600 mr-2" />
          <TranslatableText>Change Password</TranslatableText>
        </h3>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Current Password</TranslatableText>
            </label>
            <input
              type="password"
              id="current_password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>New Password</TranslatableText>
            </label>
            <input
              type="password"
              id="new_password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              <TranslatableText>Confirm New Password</TranslatableText>
            </label>
            <input
              type="password"
              id="confirm_password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <TranslatableText>Update Password</TranslatableText>
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <TranslatableText>Two-Factor Authentication</TranslatableText>
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">
              <TranslatableText>Enhance your account security by enabling two-factor authentication</TranslatableText>
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <TranslatableText>Enable</TranslatableText>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <button className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{formData.fullName}</h1>
              <p className="text-gray-600">{formData.email}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  <TranslatableText>Farmer</TranslatableText>
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">
                  <TranslatableText>Verified</TranslatableText>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'personal', label: 'Personal Info' },
                { id: 'preferences', label: 'Preferences' },
                { id: 'security', label: 'Security' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'border-b-2 border-green-500 text-green-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TranslatableText>{tab.label}</TranslatableText>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'preferences' && renderPreferences()}
            {activeTab === 'security' && renderSecurity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;