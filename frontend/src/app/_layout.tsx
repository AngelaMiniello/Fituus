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

  // 1. Verificamos la ruta exacta o el grupo
  const isAuthRoute = segments[0] === "login" || segments[0] === "register";

  useEffect(() => {
    if (!navigationState?.key) return;
    if (userData === undefined) return;

    // Si NO hay usuario y NO está en register ni login -> Redirigir al inicio del registro
    if (!userData && !isAuthRoute) {
      router.replace("/register");
    } 
    // Si SÍ hay usuario completo y quiere entrar a /login o a /register (el inicio), lo mandamos a home.
    // OJO: Si estás en /register/profile no te tiene que sacar.
    else if (userData && (segments[0] === "login" || (segments[0] === "register" && segments.length === 1))) {
      router.replace("/");
    }
  }, [userData, segments, navigationState?.key]);

  // Si no hay userData (o estás en medio del flujo de register sin context)
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
  'Chillax-Regular': require('../../../assets/fonts/Chillax-Regular.otf'),
  'Chillax-Bold': require('../../../assets/fonts/Chillax-Bold.otf'),
  'Chillax-Medium': require('../../../assets/fonts/Chillax-Medium.otf'),
  'Chillax-Semibold': require('../../../assets/fonts/Chillax-Semibold.otf'),
  'Chillax-Light': require('../../../assets/fonts/Chillax-Light.otf'),
  'Chillax-Extralight': require('../../../assets/fonts/Chillax-Extralight.otf'),
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