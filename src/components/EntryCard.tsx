import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Entry } from '../types/Entry';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  entry: Entry;
  onDelete: (id: string) => void;
}

const EntryCard: React.FC<Props> = ({ entry, onDelete }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: colors.cardBackground, 
        borderColor: colors.border 
      }]}
      onPress={() => navigation.navigate('EntryDetail', { entry })}
    >
      <Image source={{ uri: entry.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.location, { color: colors.text }]}>
            {entry.location}
          </Text>
          <Text style={[styles.timestamp, { color: colors.text }]}>
            {new Date(entry.timestamp).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: colors.secondary }]}
          onPress={(e) => {
            e.stopPropagation(); 
            onDelete(entry.id);
          }}
        >
          <Ionicons name="trash" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    padding: 0,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    transform: [{ rotate: '-0.5deg' }],
    elevation: 3,
  },
  image: {
    height: 200,
    width: '100%',
  },
  detailsContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EntryCard;