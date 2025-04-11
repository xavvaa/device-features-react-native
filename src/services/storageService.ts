
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entry } from '../types/Entry';

const STORAGE_KEY = 'JOURNAL_ENTRIES';

export const getEntries = async (): Promise<Entry[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load entries', e);
    return [];
  }
};

export const saveEntry = async (entry: Entry): Promise<boolean> => {
  try {
    const currentEntries = await getEntries();
    const newEntries = [entry, ...currentEntries];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
    return true;
  } catch (e) {
    console.error('Failed to save entry', e);
    return false;
  }
};

export const deleteEntry = async (id: string): Promise<boolean> => {
  try {
    const currentEntries = await getEntries();
    const filteredEntries = currentEntries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    return true;
  } catch (e) {
    console.error('Failed to delete entry', e);
    return false;
  }
};

export const clearAllEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear entries', e);
  }
};