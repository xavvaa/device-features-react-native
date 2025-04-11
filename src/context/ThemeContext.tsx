import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { lightTheme, darkTheme } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
  colors: typeof lightTheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('darkMode');
        if (savedTheme !== null) {
          setDarkMode(JSON.parse(savedTheme));
        }
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load theme preference', error);
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      // Fire-and-forget the async storage update
      AsyncStorage.setItem('darkMode', JSON.stringify(newMode)).catch(console.error);
      return newMode;
    });
  }, []);

  const colors = useMemo(() => darkMode ? darkTheme : lightTheme, [darkMode]);

  const value = useMemo(() => ({
    darkMode,
    toggleTheme,
    colors
  }), [darkMode, toggleTheme, colors]);

  if (!isReady) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};