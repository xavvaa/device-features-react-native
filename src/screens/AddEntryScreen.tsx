import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentAddress } from '../services/locationService';
import { saveEntry } from '../services/storageService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Entry } from '../types/Entry';
import * as Crypto from 'expo-crypto';
import { sendNotification } from '../services/notificationService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEntry'>;

const AddEntryScreen = ({ navigation }: Props) => {
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const { colors } = useTheme();

  const generateId = async () => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return [...randomBytes].map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera access is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImage(result.assets[0].uri);
        setLocationLoading(true);
        try {
          const address = await getCurrentAddress();
          setLocation(address);
        } catch (error) {
          console.error('Location error:', error);
          setLocation('Unknown Location');
        } finally {
          setLocationLoading(false);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleSave = async () => {
    if (!image) {
      Alert.alert('Error', 'Please take a photo first');
      return;
    }

    setIsSaving(true);
    
    try {
      const newEntry: Entry = {
        id: await generateId(),
        image,
        location: location || 'Unknown Location',
        timestamp: new Date().toISOString(),
      };

      const saved = await saveEntry(newEntry);
      
      if (!saved) {
        throw new Error('Failed to save entry');
      }

      // Send notification after successful save
      await sendNotification(
        'New Journal Entry', 
        `Saved location: ${newEntry.location.substring(0, 30)}...`
      );

      // Clear form and navigate back
      setImage(null);
      setLocation('');
      navigation.goBack();
      
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={takePhoto}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}

      <View style={[styles.locationContainer, { backgroundColor: colors.cardBackground }]}>
        {locationLoading ? (
          <>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              Getting location...
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="location" size={18} color={colors.primary} style={styles.locationIcon} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              {location || 'Location not available'}
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { 
            backgroundColor: (!image || isSaving) ? '#ccc' : colors.secondary,
            opacity: (!image || isSaving) ? 0.6 : 1
          }
        ]}
        onPress={handleSave}
        disabled={!image || isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="save" size={24} color="white" />
            <Text style={styles.buttonText}>Save Entry</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    gap: 8,
  },
  locationText: {
    fontSize: 16,
  },
  locationIcon: {
    marginRight: 5,
  },
});

export default AddEntryScreen;