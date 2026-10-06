import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Instância do Axios pré-configurada
export const api = axios.create({
  baseURL: 'https://unlovely-grill-overprice.ngrok-free.dev',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// 2. Interceptor para anexar o Token JWT salvo no AsyncStorage
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('@blog_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao buscar token no AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- SERVIÇOS DE PROFESSORES (TEACHERS) ---
export const getProfessores = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/teachers?page=${page}&limit=${limit}`);
    if (Array.isArray(response.data)) return response.data;
    return response.data?.teachers || response.data?.professores || response.data?.data || [];
  } catch (error: any) {
    console.log('Aviso: Rota de professores não disponível no backend. Retornando lista vazia.');
    return [];
  }
};

export const createProfessor = async (data: { nome: string; email: string }) => {
  try {
    const payload = {
      name: data.nome,
      nome: data.nome,
      email: data.email,
    };
    const response = await api.post('/teachers', payload);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao criar professor:', error.response?.data || error.message);
    throw error;
  }
};

export const updateProfessor = async (
  id: string | number, 
  data: { nome: string; email: string; role?: string }
) => {
  try {
    const payload = {
      name: data.nome,
      nome: data.nome,
      email: data.email,
      role: data.role, // Suporte para alteração de perfil (ex: 'STUDENT')
    };
    const response = await api.put(`/teachers/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao atualizar professor:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteProfessor = async (id: string | number) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao excluir professor:', error.response?.data || error.message);
    throw error;
  }
};

// --- SERVIÇOS DE ALUNOS (STUDENTS) ---
export const getAlunos = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/students?page=${page}&limit=${limit}`);
    if (Array.isArray(response.data)) return response.data;
    return response.data?.students || response.data?.alunos || response.data?.data || [];
  } catch (error: any) {
    console.log('Aviso: Rota de alunos não disponível no backend. Retornando lista vazia.');
    return [];
  }
};

export const createAluno = async (data: { nome: string; email: string }) => {
  try {
    const payload = {
      name: data.nome,
      nome: data.nome,
      email: data.email,
    };
    const response = await api.post('/students', payload);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao criar aluno:', error.response?.data || error.message);
    throw error;
  }
};

export const updateAluno = async (
  id: string | number, 
  data: { nome: string; email: string; role?: string }
) => {
  try {
    const payload = {
      name: data.nome,
      nome: data.nome,
      email: data.email,
      role: data.role, // Suporte para alteração de perfil (ex: 'TEACHER')
    };
    const response = await api.put(`/students/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao atualizar aluno:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAluno = async (id: string | number) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  } catch (error: any) {
    console.log('Erro ao excluir aluno:', error.response?.data || error.message);
    throw error;
  }
};

export default api;