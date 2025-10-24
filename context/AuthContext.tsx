import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo os tipos de dados que vêm da sua API
interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
}

interface LoginData {
  token: string;
  user: User;
}

// O que o nosso contexto vai fornecer
interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

// Criando o Contexto com um valor padrão
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Criando o "Provedor" que vai envolver nosso app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito que roda quando o app abre, para checar se o usuário já estava logado
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@PetGo:token');
        const storedUser = await AsyncStorage.getItem('@PetGo:user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Falha ao carregar dados do storage", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const login = async (data: LoginData) => {
    setUser(data.user);
    setToken(data.token);
    // Salva os dados no AsyncStorage para persistir
    await AsyncStorage.setItem('@PetGo:token', data.token);
    await AsyncStorage.setItem('@PetGo:user', JSON.stringify(data.user));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    // Limpa os dados do AsyncStorage
    await AsyncStorage.removeItem('@PetGo:token');
    await AsyncStorage.removeItem('@PetGo:user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto em outras telas
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}