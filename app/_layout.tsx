import { Stack } from 'expo-router';
import React from 'react';
// Importe o AuthProvider
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    // Envolva o Stack com o AuthProvider
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ title: 'Criar Conta' }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </AuthProvider>
  );
}