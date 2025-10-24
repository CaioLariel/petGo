import { Redirect } from 'expo-router';
import React from 'react';

// Esta é a página inicial de todo o app.
// Ela apenas redireciona o usuário para a tela de login.
export default function StartPage() {
  return <Redirect href="/login" />;
}