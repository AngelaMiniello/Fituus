import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.41:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Variable en memoria RAM (Síncrona, instantánea)
let inMemoryToken: string | null = null;

// Función para setear el token en memoria apenas te logueás
export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

// Carga inicial del token al abrir la app
SecureStore.getItemAsync("user_session").then((sessionString) => {
  if (sessionString) {
    try {
      const session = JSON.parse(sessionString);
      if (session?.token) {
        inMemoryToken = session.token;
      }
    } catch (e) {
      console.error("Error al parsear sesión guardada", e);
    }
  }
});

api.interceptors.request.use(
  async (config) => {
    // 1. Si no lo tenemos en memoria todavía, intentamos leer de SecureStore como fallback
    if (!inMemoryToken) {
      const sessionString = await SecureStore.getItemAsync("user_session");
      if (sessionString) {
        const session = JSON.parse(sessionString);
        inMemoryToken = session?.token || null;
      }
    }

    // 2. Si tenemos token (ya sea de memoria o storage), lo pegamos en el Header
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;