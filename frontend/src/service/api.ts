import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Usa la variable de entorno de Expo con fallback a tu IP de desarrollo actual
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.41:3000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      // 1. Leemos el objeto "user_session"
      const sessionString = await SecureStore.getItemAsync("user_session");
      console.log("🔍 [Interceptor] Lo que lee de SecureStore:", sessionString); // 👈 AGREGA ESTE LOG

      if (sessionString) {
        // 2. Parseamos el JSON para obtener la propiedad token
        const session = JSON.parse(sessionString);
        console.log("🔑 [Interceptor] Header adjuntado:", config.headers.Authorization);
        if (session?.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
          console.log("🔑 [Interceptor] Header adjuntado:", config.headers.Authorization);

        }
      } else {
        console.log("⚠️ [Interceptor] SecureStore devolvió NULL para 'user_session'");
      }
    } catch (error) {
      console.error("Error al obtener el token del almacenamiento seguro:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;