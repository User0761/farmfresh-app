import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseApiService } from '../services/supabaseApi';
import { useUser } from './UserContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RealtimeContextType {
  onlineUsers: string[];
  notifications: Notification[];
  isConnected: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'order' | 'product' | 'user' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  data?: any;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [subscriptions, setSubscriptions] = useState<RealtimeChannel[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (!user?.id) {
      // Clean up subscriptions when user logs out
      subscriptions.forEach(sub => sub.unsubscribe());
      setSubscriptions([]);
      setIsConnected(false);
      return;
    }

    const setupSubscriptions = async () => {
      try {
        const newSubscriptions: RealtimeChannel[] = [];

        // Subscribe based on user role
        if (user.role === 'farmer') {
          // General orders subscription for farmers
          const ordersSub = supabaseApiService.subscribeToOrders((payload) => {
            addNotification({
              type: 'order',
              title: 'Order Update',
              message: `Order status changed to ${payload.new?.status || 'updated'}`,
              data: payload
            });
          });
          newSubscriptions.push(ordersSub);
        }

        if (user.role === 'customer') {
          // Customer-specific subscriptions
          const ordersSub = supabaseApiService.subscribeToOrders((payload) => {
            addNotification({
              type: 'order',
              title: 'Order Update',
              message: `Your order status has been updated`,
              data: payload
            });
          });
          newSubscriptions.push(ordersSub);
        }

        // General product updates for all users
        const productSub = supabaseApiService.subscribeToProducts((payload) => {
          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'product',
              title: 'New Product Available',
              message: `${payload.new?.name || 'A new product'} is now available`,
              data: payload
            });
          }
        });
        newSubscriptions.push(productSub);

        setSubscriptions(newSubscriptions);
        setIsConnected(true);

        console.log('✅ Real-time subscriptions established');
      } catch (error) {
        console.error('❌ Failed to setup real-time subscriptions:', error);
        setIsConnected(false);
      }
    };

    setupSubscriptions();

    // Cleanup on unmount
    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [user?.id, user?.role]);

  // Simulate online users (in a real app, you'd track this via presence)
  useEffect(() => {
    const interval = setInterval(() => {
      // Mock online users count
      setOnlineUsers(prev => {
        const mockUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];
        const randomCount = Math.floor(Math.random() * 5) + 1;
        return mockUsers.slice(0, randomCount);
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value: RealtimeContextType = {
    onlineUsers,
    notifications,
    isConnected,
    addNotification,
    clearNotifications,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};