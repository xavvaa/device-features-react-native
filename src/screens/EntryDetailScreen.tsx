// src/screens/EntryDetailScreen.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { Entry } from '../types/Entry';

type EntryDetailScreenRouteProp = RouteProp<RootStackParamList, 'EntryDetail'>;

type Props = {
  route: EntryDetailScreenRouteProp;
};

const EntryDetailScreen: React.FC<Props> = ({ route }) => {
  const { entry } = route.params;
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: entry.image }} style={styles.image} />
      <Text style={[styles.location, { color: colors.text }]}>{entry.location}</Text>
      <Text style={[styles.date, { color: colors.text }]}>
        {new Date(entry.timestamp).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default EntryDetailScreen;