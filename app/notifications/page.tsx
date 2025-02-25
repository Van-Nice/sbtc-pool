"use client"

import React, { useState } from 'react';
import { Bell, Mail, Check } from 'lucide-react';

type Notification = {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
};

type NotificationPreferences = {
  email: boolean;
  push: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'Your 0.001 BTC contribution was received',
      timestamp: '2023-10-20T10:30:00Z',
      isRead: false,
    },
    {
      id: '2',
      message: 'Bridging completed at 14:32',
      timestamp: '2023-10-19T14:32:00Z',
      isRead: true,
    },
    {
      id: '3',
      message: 'New sBTC available for claiming',
      timestamp: '2023-10-18T09:15:00Z',
      isRead: false,
    },
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    push: false,
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Notifications
        </h1>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Mail className="mr-2" />
                  Email Notifications
                </span>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="email-notifications">
                  <input 
                    id="email-notifications"
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.email}
                    onChange={() => togglePreference('email')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Bell className="mr-2" />
                  Push Notifications
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.push}
                    onChange={() => togglePreference('push')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Notifications</h2>
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`flex items-start p-4 rounded-lg ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0 mr-4">
                    {!notification.isRead && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(notification.timestamp)}</p>
                  </div>
                  {notification.isRead && (
                    <Check className="text-green-500 ml-2" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}