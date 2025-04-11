import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={toggleTheme}
      testID="theme-toggle"
    >
      <Ionicons 
        name={darkMode ? 'sunny' : 'moon'} 
        size={24} 
        color={colors.text} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
});

export default ThemeToggle;