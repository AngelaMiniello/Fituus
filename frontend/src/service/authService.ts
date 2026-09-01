import { ILoginProps, IRegisterProps, IProfileSetup } from "../types/types";
import api from "../service/api"; // Instancia de Axios

// En React Native / Expo las variables usan EXPO_PUBLIC_
const APIURL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://10.0.2.2:3000";

// Helper para parsear respuestas de fetch si prefiero no usar Axios
async function parseResponseSafely(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { message: text || "Respuesta no válida del servidor" };
}

// 1. Servicio de Login
export async function loginService(userData: ILoginProps) {
  try {
    const response = await fetch(`${APIURL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return await parseResponseSafely(response);
    } else {
      const errorData = await parseResponseSafely(response);
      throw new Error(errorData.message || "Fallo el servidor al loguearse");
    }
  } catch (error: any) {
    // Preservar el mensaje de error original
    throw new Error(error.message || "Error al conectar con el servidor");
  }
}

// 2. Servicio de Registro
export async function register(userData: IRegisterProps) {
  try {
    const payload = {
      name: userData.name,
      userName: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      profilePic: "",
    };

    const response = await fetch(`${APIURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return await parseResponseSafely(response);
    } else {
      const errorData = await parseResponseSafely(response);
      throw new Error(errorData.message || "Error en el registro");
    }
  } catch (error: any) {
    throw new Error(error.message || "No fue posible registrar el usuario");
  }
}

// 3. Actualización de Perfil (Usando instancia de Axios)
export const updateProfile = async (data: IProfileSetup, token?: string) => {
  try {
    const response = await api.patch("/user/profile/metrics", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return response.data;
  } catch (error: any) {
    console.log("📌 Error HTTP en updateProfile:", error?.response?.status);
    console.log("📌 Detalle Backend:", error?.response?.data);
    const message = error.response?.data?.message || "Error al actualizar el perfil";
    throw new Error(message);
  }
};