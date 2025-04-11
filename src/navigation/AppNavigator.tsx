import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import EntryDetailScreen from '../screens/EntryDetailScreen';
import ThemeToggle from '../components/ThemeToggle';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { darkMode, colors } = useTheme();

  const customTheme = {
    dark: darkMode,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.cardBackground,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '800' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={customTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'My Journal' }}
        />
        <Stack.Screen 
          name="AddEntry" 
          component={AddEntryScreen} 
          options={{ title: 'New Entry' }}
        />
        <Stack.Screen 
          name="EntryDetail" 
          component={EntryDetailScreen}
          options={{ title: 'Entry Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;