import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  // URL ativa do seu túnel ngrok apontando para o backend
  baseURL: 'https://unlovely-grill-overprice.ngrok-free.dev',
  timeout: 10000,
  headers: {
    // Ignora a tela de aviso HTML inicial do ngrok para retornar diretamente o JSON
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@blog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});