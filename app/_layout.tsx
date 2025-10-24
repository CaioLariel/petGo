import { Stack } from 'expo-router';
import React from 'react';
// 1. Importe o AuthProvider e o hook
import { AuthProvider, useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Componente interno para acessar o hook useAuth
// Isso é necessário porque o hook deve estar DENTRO do provider
function RootLayoutNav() {
  const { isLoading } = useAuth();

  // Mostra um "loading" enquanto o contexto verifica o login
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // Se não está carregando, mostra as rotas
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Criar Conta' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Layout Raiz
export default function RootLayout() {
  return (
    // 2. Envolva o app com o AuthProvider
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}