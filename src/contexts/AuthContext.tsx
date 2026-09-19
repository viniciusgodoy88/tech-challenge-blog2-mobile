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
          // Injeta o token nas requisições do Axios caso o app seja reaberto
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
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
      // Ajustado para a rota /auth/login e enviando 'password' exigido pela API
      const response = await api.post('/auth/login', { 
        email, 
        password: pass 
      });
      
      // Mapeamento dinâmico da resposta da API
      const token = response.data?.token || response.data?.accessToken;
      const userData = response.data?.user || response.data?.professor || response.data?.data || { email };

      if (!token) {
        throw new Error('A API não retornou um token de autenticação válido.');
      }

      // Configura o cabeçalho global do Axios para requisições autenticadas subsequentes
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Salva token e usuário no AsyncStorage
      await AsyncStorage.setItem('@blog_token', token);
      await AsyncStorage.setItem('@blog_user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      console.error('Erro na chamada de login:', error.response?.data || error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@blog_token');
      await AsyncStorage.removeItem('@blog_user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};