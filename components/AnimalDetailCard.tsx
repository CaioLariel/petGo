import React from "react";
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { AnimalData } from "../app/types";

const BASE_API_URL = "https://petgo-backend-api.onrender.com";

interface AnimalDetailCardProps {
  animal: AnimalData | null;
  visible: boolean;
  onClose: () => void;
}

export default function AnimalDetailCard({ animal, visible, onClose }: AnimalDetailCardProps) {
  // Renderiza um loader se os dados do animal ainda não estiverem carregados
  if (!animal) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.modalOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>
    );
  }

  
  const imageUrl = animal.image_url ? `${BASE_API_URL}/${animal.image_url.replace(/\\/g, '/')}` : null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: 'hidden', 
    alignItems: "center",
    paddingBottom: 20,
  },
  animalImage: {
    width: "100%",
    height: 200,
    backgroundColor: '#eee',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
    width: '100%',
  },
  animalName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  animalInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});