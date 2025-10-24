import { Redirect } from 'expo-router';
import React from 'react';

export default function TabIndex() {
  // Esta é a tela padrão do grupo (tabs)
  // Ela apenas redireciona o usuário para a sua tela de mapa.
  return <Redirect href="/(tabs)/map" />;
}