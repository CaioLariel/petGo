import * as Location from "expo-location";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Modal,
  Alert,
  Platform,
  Text,
  TouchableOpacity, // Importado para o botão personalizado
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps"; // MapPressEvent não é mais necessário
import AnimalForm from "../components/AnimalForm";
import { UserLocation, AnimalData } from "./types";

const API_URL = "https://petgo-backend-api.onrender.com/animals";

export default function Index() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [animalData, setAnimalData] = useState<AnimalData>({ id: "", name: "", species: "", breed: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [markers, setMarkers] = useState<AnimalData[]>([]);

  const fetchAnimals = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar animais");
      const data: AnimalData[] = await response.json();

      const formattedMarkers = data.map(animal => ({
        ...animal,
        icon: animal.species === "cachorro"
          ? require("../assets/images/cachorro.png")
          : require("../assets/images/gato.png"),
      }));
      setMarkers(formattedMarkers);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível carregar os animais.");
    }
  }, []);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    const initialize = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão necessária", "É necessário permitir o acesso à localização para usar o app.");
        setLoading(false);
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      };
      setLocation(coords);
      setRegion({
        ...coords,
        latitudeDelta: 0.005, // Zoom mais próximo para facilitar a seleção
        longitudeDelta: 0.005,
      });

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (loc) => {
          setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      );

      await fetchAnimals();
      setLoading(false);
    };

    initialize();

    return () => {
      locationSubscription?.remove();
    };
  }, [fetchAnimals]);

  if (loading || !region || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={Platform.OS === 'ios' ? 'large' : 60} color="#3498db" />
      </View>
    );
  }

  // Abre o modal para o usuário preencher os dados do animal
  const handleSelectLocation = () => {
    setModalVisible(true);
  };

  const resetFormState = () => {
    setAnimalData({ id: "", name: "", species: "", breed: "" });
    setModalVisible(false);
  };

  const handleCreateAnimal = async () => {
    if (!animalData.name || !animalData.species || !animalData.breed) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Usa a latitude e longitude do centro do mapa (que está no estado 'region')
      const payload = {
        ...animalData,
        latitude: region?.latitude,
        longitude: region?.longitude,
        created_by: 1,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar animal");

      const newAnimal = await response.json();
      const newMarker = {
        ...newAnimal,
        icon: newAnimal.species === "cachorro"
          ? require("../assets/images/cachorro.png")
          : require("../assets/images/gato.png"),
      };
      setMarkers(prevMarkers => [...prevMarkers, newMarker]);
      resetFormState();
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar o animal. Tente novamente.");
    }
  };

  const handleCancel = () => {
    resetFormState();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion} // Atualiza a região central quando o usuário move o mapa
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers
          .filter(m => m.latitude != null && m.longitude != null)
          .map((m) => (
            <Marker
              key={m.id}
              coordinate={{ latitude: m.latitude!, longitude: m.longitude! }}
              title={m.name}
              description={`Raça: ${m.breed}`}
            >
              <Image source={m.icon} style={styles.markerIcon} />
            </Marker>
          ))}
      </MapView>

      {/* Pino central que fica fixo sobre o mapa */}
      <View style={styles.centralPinContainer}>
        <Image
          source={require('../assets/images/pin.png')} // Lembre-se de adicionar a imagem!
          style={styles.centralPin}
        />
      </View>

      {/* Botão estilizado para confirmar a localização */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSelectLocation}>
          <Text style={styles.actionButtonText}>Identificar Animal Neste Ponto</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCancel}
      >
        <AnimalForm
          animalData={animalData}
          setAnimalData={setAnimalData}
          onSave={handleCreateAnimal}
          onCancel={handleCancel}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  // Estilo para o container do pino central
  centralPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Centraliza a imagem do pino pelo seu centro, não pelo canto
    transform: [{ translateX: -25 }, { translateY: -50 }],
  },
  // Estilo para a imagem do pino
  centralPin: {
    width: 30,
    height: 50,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  // Estilo para o botão de ação principal
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Estilo para o texto do botão de ação
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
});