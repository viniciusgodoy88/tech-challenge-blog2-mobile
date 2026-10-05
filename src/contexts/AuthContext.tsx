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
          const parsedUser = JSON.parse(storedUser);
          
          // Injeta o token armazenado nas requisições do Axios
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(parsedUser);
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
      // Mapeia e envia 'password' para a rota /auth/login do backend
      const response = await api.post('/auth/login', { 
        email: email.trim(), 
        password: pass.trim() 
      });

      console.log('=== RESPOSTA DO BACKEND /AUTH/LOGIN ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=======================================');

      // Extração flexível do token JWT
      const token = response.data?.token || 
                    response.data?.accessToken || 
                    response.data?.jwt || 
                    response.data?.data?.token;

      if (!token) {
        throw new Error('A API respondeu com sucesso, mas não retornou um token JWT válido.');
      }

      // Extrai os dados do usuário e garante o perfil TEACHER para liberação das telas
      const rawUser = response.data?.user || 
                       response.data?.professor || 
                       response.data?.usuario || 
                       response.data?.data?.user || 
                       { email: email.trim() };

      const userData = {
        ...rawUser,
        role: 'TEACHER',
      };

      // Injeta o cabeçalho Bearer Token no Axios para requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Armazena token e dados do usuário no AsyncStorage
      await AsyncStorage.setItem('@blog_token', token);
      await AsyncStorage.setItem('@blog_user', JSON.stringify(userData));

      // Atualiza o estado do contexto, disparando a transição no aplicativo
      setUser(userData);
    } catch (error: any) {
      console.error('Erro de Autenticação:', error.response?.data || error.message);
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