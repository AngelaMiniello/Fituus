import { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { isAxiosError } from "axios";
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import api from "../../service/api";
import { useAuth } from "../../context/AuthContext";

GoogleSignin.configure({
  webClientId: "TU_ID_WEB.apps.googleusercontent.com",
});

export default function RegisterOptionsView() {
  const router = useRouter();
  const { setUserData } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result = await GoogleSignin.signIn();

      if (!isSuccessResponse(result)) return;

      const idToken = result.data.idToken;

      if (!idToken) {
        Alert.alert("Google", "No se obtuvo el token. Revisá el ID Web.");
        return;
      }

      const response = await api.post("/auth/google", { idToken });

      const sessionData = {
        token: response.data.token,
        user: response.data.user,
      };

      await SecureStore.setItemAsync(
        "user_session",
        JSON.stringify(sessionData)
      );

      setUserData(sessionData);
      router.replace("/home");
    } catch (error: unknown) {
      if (isErrorWithCode(error)) {
        if (
          error.code === statusCodes.SIGN_IN_CANCELLED ||
          error.code === statusCodes.IN_PROGRESS
        ) {
          return;
        }

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert("Google", "Actualizá Google Play Services.");
          return;
        }
      }
  
      const message = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ||
          "No se pudo conectar con el servidor."
        : error instanceof Error
          ? error.message
          : "No se pudo continuar con Google.";

      Alert.alert("Registro con Google", message);
    } finally {
      setGoogleLoading(false);
    }
  };

    return (
      <View style={{ flex: 1, width: "100%",  height: "100%", justifyContent: "flex-end" }}>

        {/* 1. Imagen de fondo en posición absoluta */}
        <Image
          source={require("../../assets/images/public/bg1.png")}
          style={[
            StyleSheet.absoluteFillObject,
            { width: "100%", height: "100%", resizeMode: "contain" }
          ]}
        />

        {/* 2. Overlay transparente por encima del fondo */}
        <View style={StyleSheet.absoluteFillObject} className="bg-black/10" pointerEvents="none" />

          {/* 3. Contenedor de contenido (con zIndex explícito para ir al frente) */}
          <View style={{ zIndex: 20 }} className="flex-col gap-2 px-8 pb-12 mt-auto mb-14" >

            {/* 4. Contenido de la parte inferior */}
            <View className="flex-col gap-3">
              
              {/* Botón Google */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="items-center justify-center w-full py-4 bg-black rounded-full"
                onPress={handleGoogleLogin}
                disabled={googleLoading}
                style={{ opacity: googleLoading ? 0.6 : 1 }}
              >
                <Text className="text-lg font-medium text-white">
                  {googleLoading ? "Conectando…" : "Continuar con Google"}
                </Text>
              </TouchableOpacity>

              {/* Botón Create Account */}
              <TouchableOpacity
                activeOpacity={0.8}
                className="items-center justify-center w-full py-4 bg-transparent border-2 border-black rounded-full"
                onPress={() => router.push("/register/signup" as any)}
              >
                <Text className="text-lg font-medium text-black"> Create Account </Text>
              </TouchableOpacity>
            </View>

            {/* Texto "Already have an account? Log In" */}
            <View className="flex-row items-center justify-center mt-4">
              <Text className="font-semibold text-black/70"> Already have an account?{" "} </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/login")}
              >
                <Text className="font-bold text-black">Log In</Text>
              </TouchableOpacity>
            </View>

          </View>
       </View>
  );
}