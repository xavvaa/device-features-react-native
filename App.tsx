// App.tsx
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { setupNotificationHandlers } from './src/services/notificationService';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

const App = () => {
  useEffect(() => {
    setupNotificationHandlers();
    
    Notifications.dismissAllNotificationsAsync();
    Notifications.setBadgeCountAsync(0);
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

export default App;