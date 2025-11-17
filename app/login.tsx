import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Link, Stack } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // 1. Importe o hook

// URL da sua API de login
// const API_URL = 'http://localhost:3000/users/login';
const API_URL = 'https://petgo-backend-api.onrender.com/users/login';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth(); // 2. Pegue a função de login

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // 3. Chame a função login do contexto
        await login(data.data);
        // O AuthContext cuidará do redirecionamento!
      } else {
        // Erro vindo da API
        setError(data.message || 'Credenciais inválidas.');
      }
    } catch (err) {
      // Erro de rede/conexão
      console.error(err);
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Isso esconde o cabeçalho "login" nesta tela */}
      <Stack.Screen options={{ headerShown: false }} /> 

      <Text style={styles.title}>PetGo</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <Button
          title="Entrar"
          onPress={handleLogin}
          color="#3498db"
        />
      )}

      {/* Link é o componente do Expo Router para navegar */}
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#3498db',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});