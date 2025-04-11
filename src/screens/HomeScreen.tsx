import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EntryCard from '../components/EntryCard';
import { Entry } from '../types/Entry';
import { deleteEntry, getEntries } from '../services/storageService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const { colors } = useTheme();

  const load = async () => setEntries(await getEntries());

  const removeEntry = async (id: string) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this entry?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            await deleteEntry(id);
            load();
          }
        }
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Ionicons name="add" size={24} color={colors.text} style={styles.addIcon} />
        <Text style={[styles.addButtonText, { color: colors.text }]}>New Entry</Text>
      </TouchableOpacity>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="journal" size={60} color={colors.text} style={{ opacity: 0.5 }} />
          <Text style={[styles.emptyText, { color: colors.text }]}>No entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryCard entry={item} onDelete={removeEntry} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addIcon: {
    marginRight: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default HomeScreen;