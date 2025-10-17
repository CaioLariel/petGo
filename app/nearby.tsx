import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import Slider from '@react-native-community/slider';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { AnimalData, UserLocation } from './types';
import AnimalDetailCard from '../components/AnimalDetailCard';

const BASE_API_URL = "https://petgo-backend-api.onrender.com";
const ANIMALS_ENDPOINT = `${BASE_API_URL}/animals`;
const ITEMS_PER_PAGE = 10;

const estimateTime = (distanceInMeters: number) => {
  const walkingSpeedKmh = 5;
  const drivingSpeedKmh = 30;
  const distanceInKm = distanceInMeters / 1000;
  
  const walkingMinutes = Math.round((distanceInKm / walkingSpeedKmh) * 60);
  const drivingMinutes = Math.round((distanceInKm / drivingSpeedKmh) * 60);

  return { walkingMinutes, drivingMinutes };
};

export default function NearbyScreen() {
  const [allAnimals, setAllAnimals] = useState<AnimalData[]>([]);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalData | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  // NOVOS ESTADOS para filtro e paginação
  const [distanceFilter, setDistanceFilter] = useState(5); // Padrão de 5 km
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLocationAndAnimals = async () => {
      setLoading(true);
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('A permissão de localização é necessária para encontrar animais próximos.');
        setLoading(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

        const response = await fetch(ANIMALS_ENDPOINT);
        if (!response.ok) throw new Error('Falha ao buscar animais.');
        const data = await response.json();
        setAllAnimals(data);

      } catch (err) {
        setError('Não foi possível carregar os dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndAnimals();
  }, []);
  
  // LÓGICA ATUALIZADA: Primeiro filtra e ordena a lista completa
  const filteredAndSortedAnimals = useMemo(() => {
    if (!location || allAnimals.length === 0) return [];
    
    const distanceInMeters = distanceFilter * 1000;

    return allAnimals
      .map(animal => {
        if (animal.latitude == null || animal.longitude == null) return null;
        
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: animal.latitude, longitude: animal.longitude }
        );
        return { ...animal, distance };
      })
      .filter((animal): animal is AnimalData & { distance: number } => animal !== null && animal.distance <= distanceInMeters)
      .sort((a, b) => a.distance - b.distance);
  }, [location, allAnimals, distanceFilter]);

  // NOVA LÓGICA: Aplica a paginação na lista já filtrada
  const paginatedAnimals = useMemo(() => {
    return filteredAndSortedAnimals.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredAndSortedAnimals, currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
  
  const handleAnimalPress = (animal: AnimalData) => {
    setSelectedAnimal(animal);
    setIsCardVisible(true);
  };
  
  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedAnimal(null);
  };

  const renderAnimalItem = ({ item }: { item: AnimalData & { distance: number } }) => {
    const { walkingMinutes, drivingMinutes } = estimateTime(item.distance);
    const imageUrl = item.image_url ? `${BASE_API_URL}/${item.image_url.replace(/\\/g, '/')}` : null;
    
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleAnimalPress(item)}>
        <Image 
          source={imageUrl ? { uri: imageUrl } : require('../assets/images/placeholder.png')} 
          style={styles.itemImage} 
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemBreed}>{item.breed}</Text>
          <Text style={styles.itemStatus}>Saúde: {item.health_status}</Text>
          <View style={styles.distanceContainer}>
            <View style={styles.timeInfo}><FontAwesome name="car" size={16} color="#555" /><Text style={styles.timeText}>{drivingMinutes} min</Text></View>
            <View style={styles.timeInfo}><MaterialCommunityIcons name="walk" size={18} color="#555" /><Text style={styles.timeText}>{walkingMinutes} min</Text></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListFooter = () => {
    if (paginatedAnimals.length < filteredAndSortedAnimals.length) {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreButtonText}>Carregar Mais</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3498db" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Distância Máxima: <Text style={styles.filterValue}>{distanceFilter} km</Text></Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={distanceFilter}
          onValueChange={value => setDistanceFilter(value)}
          minimumTrackTintColor="#3498db"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#3498db"
        />
      </View>
      <FlatList
        data={paginatedAnimals}
        renderItem={renderAnimalItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View style={styles.center}><Text>Nenhum animal encontrado neste raio.</Text></View>}
        ListFooterComponent={renderListFooter}
      />
      <AnimalDetailCard
        animal={selectedAnimal}
        visible={isCardVisible}
        onClose={handleCloseCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', paddingHorizontal: 20 },
  filterContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  filterValue: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  listContent: { padding: 10 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemImage: { width: 90, height: 90, borderRadius: 10, marginRight: 15 },
  itemContent: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemBreed: { fontSize: 14, color: '#666', marginTop: 2 },
  itemStatus: { fontSize: 14, color: '#666', marginTop: 2, fontStyle: 'italic' },
  distanceContainer: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  timeInfo: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  timeText: { marginLeft: 5, fontSize: 14, color: '#333' },
  loadMoreButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    margin: 10,
  },
  loadMoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});