import { useState } from "react";
import api from "../../service/api";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mail, Eye, EyeOff } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { GoogleSignin, GoogleSigninButton, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
import { isAxiosError } from "axios";

GoogleSignin.configure({
  webClientId: "518195228268-j7p8abmfbgfoblv08r073g0prvi01uvq.apps.googleusercontent.com",
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
 
  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
         
      // 1. Preparamos el objeto de sesión (token + user)
    const sessionData = {
      token: response.data.token,
      user: response.data.user,
    };

    // 1️⃣ PRIMERO: Aseguramos la escritura en SecureStore
    await SecureStore.setItemAsync("user_session", JSON.stringify(sessionData));

    // 2️⃣ SEGUNDO: Actualizamos el estado global (así cuando fetchGoals reaccione, el storage ya tiene el token)
    setUserData(sessionData);

    // 4. Redirigimos
    router.replace("/home");
  } catch (error) {
    console.error("Error en el login:", error);
  }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result = await GoogleSignin.signIn();

      // Si el usuario cierra el selector, no continuamos.
      if (!isSuccessResponse(result)) return;

      const idToken = result.data.idToken;

      if (!idToken) {
        Alert.alert(
          "Google",
          "No se obtuvo el token. Revisá el ID Web configurado."
        );
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
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return;

        if (error.code === statusCodes.IN_PROGRESS) return;

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert(
            "Google",
            "Actualizá Google Play Services para iniciar sesión."
          );
          return;
        }
      }

      const message = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ||
          "No se pudo conectar con el servidor."
        : error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión con Google.";

      Alert.alert("Inicio de sesión", message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%", height: "100%"}}>

      <Image
        source={require("@/assets/images/public/bg.png")}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%", resizeMode: "cover" }
        ]}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }} showsVerticalScrollIndicator={false}>

        {/* Brand Header */}
        <View className="mt-4 mb-8">
          <Text className="text-lg text-gray-900 font-chillax-bold">fituus</Text>
        </View>

        {/*Form Wrapper */}
        <View className="px-4 py-4 my-auto">
          <View className="items-center w-full mb-8">
            <Text className="text-3xl leading-tight tracking-wide text-gray-900 font-chillax-bold ">Login</Text>
          </View>

          <View className="w-full p-4 border rounded-3xl bg-pink-300/70 border-white/20">  
            <View className="flex-col gap-2">
              <View>
                <View className="relative items-center justify-center mb-3">
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#71717a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                    onChangeText={setEmail}
                  />
                  <View className="absolute pointer-events-none right-4">
                    <Mail size={20} color="#71717a" />
                  </View>
                </View>
              </View>

              <View>
                <View className="relative items-center justify-center mb-3">
                  <TextInput
                    secureTextEntry
                    placeholder="Password"
                    placeholderTextColor="#71717a"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                    value={password}
                    onChangeText={setPassword}
                  />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute p-1 right-4"
                    >
                      {showPassword ? (
                        <EyeOff size={20} color="#71717a" />
                      ) : (
                        <Eye size={20} color="#71717a" />
                      )}
                    </TouchableOpacity>
                  </View>
              </View>

              <TouchableOpacity 
                onPress={handleLogin}
                className="py-4 mt-2 items-center justify-center rounded-full bg-[#7999D9]"
              >
                <Text className="text-lg font-bold text-white font-chillax">Login</Text>
              </TouchableOpacity>

              <View style={{ alignItems: "center", marginTop: 16 }}>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={handleGoogleLogin}
                  disabled={googleLoading}
                />

  {googleLoading && (
    <Text style={{ marginTop: 8 }}>
      Conectando con Google…
    </Text>
  )}
</View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}