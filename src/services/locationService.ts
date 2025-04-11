import * as Location from 'expo-location';

export const getCurrentAddress = async (): Promise<string> => {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Reverse geocode
    const [address] = await Location.reverseGeocodeAsync(location.coords);
    
    // Build address string
    const addressParts = [
      address?.name,
      address?.street,
      address?.city,
      address?.region,
      address?.country
    ].filter(Boolean);

    return addressParts.length > 0 
      ? addressParts.join(', ')
      : `Lat: ${location.coords.latitude.toFixed(4)}, Long: ${location.coords.longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Location error:', error);
    throw error;
  }
};