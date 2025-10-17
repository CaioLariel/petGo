import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AnimalData } from "../app/types";

interface AnimalFormProps {
  animalData: AnimalData;
  setAnimalData: (data: AnimalData) => void;
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AnimalForm({ animalData, setAnimalData, imageUri, setImageUri, onSave, onCancel }: AnimalFormProps) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da sua permissão para acessar a galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Cadastrar Animal</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do animal"
              value={animalData.name}
              onChangeText={(text) => setAnimalData({ ...animalData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Espécie</Text>
            <View style={styles.speciesSelector}>
              <TouchableOpacity
                style={[styles.speciesButton, animalData.species === "cachorro" && styles.speciesButtonSelected]}
                onPress={() => setAnimalData({ ...animalData, species: "cachorro" })}
              >
                <Text style={[styles.speciesButtonText, animalData.species === "cachorro" && styles.speciesButtonTextSelected]}>
                  Cachorro
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.speciesButton, animalData.species === "gato" && styles.speciesButtonSelected]}
                onPress={() => setAnimalData({ ...animalData, species: "gato" })}
              >
                <Text style={[styles.speciesButtonText, animalData.species === "gato" && styles.speciesButtonTextSelected]}>
                  Gato
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Vira-lata, Poodle..."
              value={animalData.breed}
              onChangeText={(text) => setAnimalData({ ...animalData, breed: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado de Saúde</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Saudável, Ferido..."
              value={animalData.health_status || ''}
              onChangeText={(text) => setAnimalData({ ...animalData, health_status: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto do Animal</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
              <Text style={[styles.buttonText, styles.saveButtonText]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', width: '100%' },
  container: { width: "90%", padding: 20, backgroundColor: "#fff", borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#555" },
  input: { borderWidth: 1, borderColor: "#ddd", backgroundColor: "#f9f9f9", borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: "#333" },
  speciesSelector: { flexDirection: "row", justifyContent: "space-between" },
  speciesButton: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, alignItems: "center", marginHorizontal: 5, backgroundColor: "#f9f9f9" },
  speciesButtonSelected: { backgroundColor: "#3498db", borderColor: "#3498db" },
  speciesButtonText: { fontSize: 16, fontWeight: "600", color: "#555" },
  speciesButtonTextSelected: { color: "#fff" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { flex: 1, paddingVertical: 15, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  cancelButton: { backgroundColor: "#e0e0e0" },
  saveButton: { backgroundColor: "#27ae60" },
  buttonText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  saveButtonText: { color: "#fff" },
  imagePickerButton: { backgroundColor: '#eaf2f8', borderColor: '#aed6f1', borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  imagePickerButtonText: { color: '#3498db', fontWeight: '600', fontSize: 16 },
  imagePreview: { width: '100%', height: 150, borderRadius: 8, marginTop: 15, backgroundColor: '#f0f0f0' },
});