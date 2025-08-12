import React, { useState } from 'react';
import { Bell, AlertCircle, MessageCircle, TrendingUp, CloudRain, Check, Trash2, Calendar, Clock, ChevronRight } from 'lucide-react';
import TranslatableText from '../components/TranslatableText';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in your area in the next 24 hours. Consider protecting your crops.',
      time: '2 hours ago',
      date: '2023-10-15',
      read: false
    },
    {
      id: 2,
      type: 'market',
      title: 'Price Update',
      message: 'Tomato prices have increased by 15% in your local market.',
      time: '5 hours ago',
      date: '2023-10-15',
      read: false
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'Vendor Rajesh Kumar has shown interest in your wheat listing.',
      time: '1 day ago',
      date: '2023-10-14',
      read: true
    },
    {
      id: 4,
      type: 'alert',
      title: 'Disease Alert',
      message: 'Early blight detected in tomato crops in your district. Check your plants for symptoms.',
      time: '2 days ago',
      date: '2023-10-13',
      read: true
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'KrishiMitra app has been updated to version 2.0 with new features.',
      time: '3 days ago',
      date: '2023-10-12',
      read: true
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('all');

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'market':
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      case 'message':
        return <MessageCircle className="w-6 h-6 text-purple-500" />;
      case 'weather':
        return <CloudRain className="w-6 h-6 text-cyan-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeFilter);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <TranslatableText>Notifications</TranslatableText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <TranslatableText>Stay updated with important alerts and messages</TranslatableText>
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-2 mb-4 md:mb-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'alert', label: 'Alerts' },
                { id: 'market', label: 'Market' },
                { id: 'message', label: 'Messages' },
                { id: 'system', label: 'System' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <TranslatableText>{filter.label}</TranslatableText>
                  {filter.id === 'all' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto justify-end">
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                disabled={!notifications.some(n => !n.read)}
              >
                <Check className="w-4 h-4 mr-1" />
                <TranslatableText>Mark all read</TranslatableText>
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <TranslatableText>Clear all</TranslatableText>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-green-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{notification.date}</span>
                          <Clock className="w-3 h-3 ml-3 mr-1" />
                          <span>{notification.time}</span>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-green-600 hover:text-green-700 flex items-center"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              <TranslatableText>Mark as read</TranslatableText>
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            <TranslatableText>Delete</TranslatableText>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                <TranslatableText>No notifications</TranslatableText>
              </h3>
              <p className="text-gray-500">
                <TranslatableText>
                  {activeFilter === 'all' 
                    ? 'You don\'t have any notifications yet' 
                    : `You don't have any ${activeFilter} notifications`}
                </TranslatableText>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;