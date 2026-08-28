import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
// 1. Importo useRootNavigationState
import { Slot, SplashScreen, useRouter, useSegments, useRootNavigationState } from "expo-router";import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { GoalsProvider } from "../context/GoalsContext";
import { DailyProgressProvider } from "../context/DailyProgress";

import Navtop from "@/components/ui/Navtop";
import Navbottom from "@/components/ui/Navbottom";

SplashScreen.preventAutoHideAsync();

// 1. Componente interno para controlar el flujo
function MainContent() {
  const { userData } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const navigationState = useRootNavigationState();

  //Acepto tanto "register" como "login" como rutas públicas/de auth
  const isAtAuth = segments[0] === "register" || segments[0] === "login";

  useEffect(() => {
    if (!navigationState?.key) return;
    if (userData === undefined) return;

    // Si NO hay usuario y NO está en register ni login -> Redirigir a register
    if (!userData && !isAtAuth) {
      router.replace("/register");
    } 
    // Si SÍ hay usuario pero intenta ver register o login -> Redirigir al inicio
    else if (userData && isAtAuth) {
      router.replace("/");
    }
  }, [userData, segments, navigationState?.key]);

  // Si no está logueado, sólo muestro la pantalla de Registro limpia (sin Navtop ni Navbottom)
  if (!userData) {
    return (
      <View className="flex-1 bg-zinc-950">
        <Slot />
      </View>
    );
  }

  // Si SÍ está logueado, muestro el Layout completo con Navtop y Navbottom
  return (
    <View className="flex-1 bg-zinc-950">
      <Navtop />
      <View className="flex-1">
        <Slot />
      </View>
      <Navbottom />
    </View>
  );
}

// 2. Componente principal exportado
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Chillax: require("../../assets/fonts/Chillax-Regular.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <GoalsProvider>
        <DailyProgressProvider>
          <SafeAreaView className="flex-1 bg-zinc-950">
            <MainContent />
          </SafeAreaView>
        </DailyProgressProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}