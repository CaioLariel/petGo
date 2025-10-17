import React from "react";
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ActivityIndicator, Linking, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AnimalData } from "../app/types";

const BASE_API_URL = "https://petgo-backend-api.onrender.com";

interface AnimalDetailCardProps {
  animal: AnimalData | null;
  visible: boolean;
  onClose: () => void;
}

export default function AnimalDetailCard({ animal, visible, onClose }: AnimalDetailCardProps) {
  if (!animal) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>
    );
  }

  const handleNavigate = () => {
    if (!animal.latitude || !animal.longitude) {
      Alert.alert("Erro", "A localização deste animal não está disponível.");
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${animal.latitude},${animal.longitude}`;
    Linking.openURL(url).catch(err => Alert.alert("Erro", "Não foi possível abrir o Google Maps."));
  };

  const imageUrl = animal.image_url ? `${BASE_API_URL}/${animal.image_url.replace(/\\/g, '/')}` : null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.cardContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.animalImage} />
          ) : (
            <View style={[styles.animalImage, styles.placeholderImage]}>
              <Text>Sem Imagem</Text>
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.animalName}>{animal.name}</Text>
            <Text style={styles.animalInfo}>Espécie: {animal.species}</Text>
            <Text style={styles.animalInfo}>Raça: {animal.breed}</Text>
            <Text style={styles.animalInfo}>Estado: {animal.health_status}</Text>
          </View>
          
          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
            <FontAwesome name="map-marker" size={20} color="#fff" />
            <Text style={styles.navigateButtonText}>Ir até o Animal</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" },
  cardContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 15, overflow: 'hidden', alignItems: "center", paddingTop: 0 },
  animalImage: { width: "100%", height: 200, backgroundColor: '#eee' },
  placeholderImage: { justifyContent: 'center', alignItems: 'center' },
  infoContainer: { padding: 20, width: '100%' },
  animalName: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  animalInfo: { fontSize: 16, marginBottom: 8, color: '#333' },
  navigateButton: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});