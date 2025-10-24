import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RescuedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animais Resgatados</Text>
      <Text style={styles.subtitle}>Aqui será exibida a lista de animais que você resgatou.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
});