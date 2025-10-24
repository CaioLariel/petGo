import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { useRouter, Stack, Link } from 'expo-router';

// URL da sua API para criar usuários
const API_URL = 'https://petgo-backend-api.onrender.com/users'; 

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !cpf || !password) {
      setError('Todos os campos são obrigatórios.');
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
          name,
          email,
          cpf,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Sucesso!
        Alert.alert('Sucesso', 'Cadastro realizado! Faça seu login.');
        // Manda o usuário de volta para o Login
        router.push('/login'); 
      } else {
        // Erro vindo da API (ex: 'Email ou CPF já cadastrado.')
        setError(data.message || 'Não foi possível criar a conta.');
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Configura o cabeçalho desta tela */}
      <Stack.Screen options={{ title: 'Criar Conta' }} /> 

      <Text style={styles.title}>Crie sua Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />
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
        placeholder="CPF (ex: 123.456.789-00)"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
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
          title="Cadastrar"
          onPress={handleRegister}
          color="#3498db"
        />
      )}

      <Link href="/login" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

// Estilos (similares ao Login)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Permite o ScrollView crescer
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
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