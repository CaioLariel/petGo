import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AnimalData } from "../app/types";

// Interface para as propriedades do componente
interface AnimalFormProps {
  animalData: AnimalData;
  setAnimalData: (data: AnimalData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AnimalForm({ animalData, setAnimalData, onSave, onCancel }: AnimalFormProps) {
  return (
    // Container que centraliza o formulário na tela e escurece o fundo
    <View style={styles.modalOverlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastrar Animal</Text>

        {/* Campo de Nome */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do animal"
            value={animalData.name}
            onChangeText={(text) => setAnimalData({ ...animalData, name: text })}
          />
        </View>

        {/* Seletor de Espécie com botões personalizados */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Espécie</Text>
          <View style={styles.speciesSelector}>
            <TouchableOpacity
              style={[
                styles.speciesButton,
                animalData.species === "cachorro" && styles.speciesButtonSelected,
              ]}
              onPress={() => setAnimalData({ ...animalData, species: "cachorro" })}
            >
              <Text style={[
                styles.speciesButtonText,
                animalData.species === "cachorro" && styles.speciesButtonTextSelected
              ]}>
                Cachorro
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.speciesButton,
                animalData.species === "gato" && styles.speciesButtonSelected,
              ]}
              onPress={() => setAnimalData({ ...animalData, species: "gato" })}
            >
              <Text style={[
                styles.speciesButtonText,
                animalData.species === "gato" && styles.speciesButtonTextSelected
              ]}>
                Gato
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo de Raça */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raça</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a raça do animal"
            value={animalData.breed}
            onChangeText={(text) => setAnimalData({ ...animalData, breed: text })}
          />
        </View>

        {/* Botões de Ação */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
            <Text style={[styles.buttonText, styles.saveButtonText]}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Estilos aprimorados para o formulário
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  speciesSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  speciesButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
  },
  speciesButtonSelected: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  speciesButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  speciesButtonTextSelected: {
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  saveButton: {
    backgroundColor: "#27ae60",
  },
  buttonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButtonText: {
    color: "#fff",
  },
});


