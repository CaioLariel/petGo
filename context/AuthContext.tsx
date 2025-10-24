import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';

// Tipos para os dados do contexto
type AuthData = {
  token: string | null;
  userId: string | null;
  login: (data: UserData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

// Dados do usuário que esperamos da API
type UserData = {
  token: string;
  user: {
    id: string; // O mais importante
    name?: string;
    email?: string;
  };
};

const AuthContext = createContext<AuthData | undefined>(undefined);

// Este é o Provedor que irá envolver seu app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const segments = useSegments(); // Segmentos da URL atual

  // Carrega o token/ID do storage seguro quando o app inicia
  useEffect(() => {
    async function loadAuthData() {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        const storedUserId = await SecureStore.getItemAsync('userId');
        
        if (storedToken && storedUserId) {
          setToken(storedToken);
          setUserId(storedUserId);
        }
      } catch (e) {
        console.error("Erro ao carregar dados de autenticação", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadAuthData();
  }, []);

  // Efeito para redirecionar o usuário com base no estado de login
  useEffect(() => {
    if (isLoading) return; // Não faz nada enquanto carrega

    // Verifica se a rota atual está no grupo de autenticação
    const inAuthGroup = segments.includes('login') || segments.includes('register');

    if (!token && !inAuthGroup) {
      // Se não está logado E NÃO está nas telas de login/cadastro,
      // redireciona para o login.
      router.replace('/login');
    } else if (token && inAuthGroup) {
      // Se ESTÁ logado E ESTÁ nas telas de login/cadastro,
      // redireciona para o mapa.
      router.replace('/(tabs)/map');
    }
  }, [token, segments, isLoading, router]);

  // Função de Login: salva dados no estado e no SecureStore
  const login = async (data: UserData) => {
    try {
      setToken(data.token);
      setUserId(String(data.user.id));
      await SecureStore.setItemAsync('token', data.token);
      await SecureStore.setItemAsync('userId', String(data.user.id));
      // O useEffect acima cuidará do redirecionamento
    } catch (e) {
      console.error("Erro ao salvar dados de login", e);
    }
  };

  // Função de Logout: limpa dados do estado e do SecureStore
  const logout = async () => {
    try {
      setToken(null);
      setUserId(null);
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('userId');
      // O useEffect acima cuidará do redirecionamento
    } catch (e) {
      console.error("Erro ao limpar dados de logout", e);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ token, userId, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}