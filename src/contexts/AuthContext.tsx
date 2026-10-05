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
          const userRole = String(parsedUser.role || '').toUpperCase();

          // Garante que apenas perfis autorizados permaneçam logados ao reabrir o app
          if (userRole === 'TEACHER' || userRole === 'SUPERADMIN') {
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            setUser(parsedUser);
          } else {
            await AsyncStorage.multiRemove(['@blog_token', '@blog_user']);
          }
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

      // Extração flexível dos dados do usuário
      const userData = response.data?.user || 
                       response.data?.professor || 
                       response.data?.usuario || 
                       response.data?.student || 
                       response.data?.data?.user || 
                       { email: email.trim() };

      if (!token) {
        throw new Error('A API respondeu com sucesso, mas não retornou um token JWT reconhecido.');
      }

      // Normaliza e valida a role
      const userRole = String(userData.role || '').toUpperCase();

      if (userRole === 'STUDENT' || (userRole !== 'TEACHER' && userRole !== 'SUPERADMIN')) {
        throw new Error('Acesso restrito. Apenas docentes e administradores possuem permissão para acessar o painel.');
      }

      // Injeta o token nas requisições HTTP
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Salva os dados no armazenamento local
      await AsyncStorage.setItem('@blog_token', token);
      await AsyncStorage.setItem('@blog_user', JSON.stringify(userData));

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