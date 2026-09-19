import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface Credentials {
  email: string;
  pass: string;
}

interface AuthContextData {
  signed: boolean;
  user: any;
  signIn: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@blog_token');
        const storedUser = await AsyncStorage.getItem('@blog_user');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const signIn = async ({ email, pass }: Credentials) => {
    try {
      // Envia tanto 'pass' quanto 'password' para garantir compatibilidade com o backend
      const response = await api.post('/login', { email, pass, password: pass });
      
      // Mapeia flexivelmente caso a API retorne { token, user } ou { accessToken, professor }
      const token = response.data?.token || response.data?.accessToken;
      const userData = response.data?.user || response.data?.professor || response.data?.data || { email };

      if (!token) {
        throw new Error('A API não retornou um token de autenticação válido.');
      }

      await AsyncStorage.setItem('@blog_token', token);
      await AsyncStorage.setItem('@blog_user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      console.error('Erro de Autenticação:', error.response?.data || error.message);
      throw error;
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@blog_token');
    await AsyncStorage.removeItem('@blog_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};