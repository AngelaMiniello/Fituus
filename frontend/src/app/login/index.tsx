import { useState } from "react";
import api from "../../service/api";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mail, Eye, EyeOff } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from "@react-native-google-signin/google-signin";
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
          "Google did not return a sign-in token. Please try again."
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
            "Please update Google Play Services to sign in."
          );
          return;
        }
      }

      const message = isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ||
          "Could not connect to the server."
        : error instanceof Error
          ? error.message
          : "Could not sign in with Google.";

      Alert.alert("Sign in", message);
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

          <View className="w-full p-4 border rounded-3xl bg-gray-200/70 border-white/20">
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

              <TouchableOpacity
                onPress={handleGoogleLogin}
                disabled={googleLoading}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
                accessibilityState={{ disabled: googleLoading, busy: googleLoading }}
                style={{ opacity: googleLoading ? 0.65 : 1 }}
                className="flex-row items-center justify-center w-full px-4 py-4 mt-3 border border-white rounded-full bg-white/85"
              >
                {googleLoading ? <ActivityIndicator size="small" color="#4769A8" /> : (
                  <Svg width={20} height={20} viewBox="0 0 24 24" accessible={false}>
                    <Path fill="#4285F4" d="M22.56 12.25c0-.73-.06-1.42-.19-2.09H12v3.96h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.75 3.28-7.95Z" />
                    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.8l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.87 0-5.3-1.94-6.17-4.55H2.15v2.85A11 11 0 0 0 12 23Z" />
                    <Path fill="#FBBC05" d="M5.83 13.95A6.6 6.6 0 0 1 5.48 12c0-.68.12-1.34.35-1.95V7.2H2.15A11 11 0 0 0 1 12c0 1.78.42 3.47 1.15 4.8l3.68-2.85Z" />
                    <Path fill="#EA4335" d="M12 5.5c1.62 0 3.07.56 4.21 1.64l3.16-3.16A10.56 10.56 0 0 0 12 1a11 11 0 0 0-9.85 6.2l3.68 2.85C6.7 7.44 9.13 5.5 12 5.5Z" />
                  </Svg>
                )}
                <Text style={{ fontFamily: "Chillax-Medium" }} className="ml-3 text-base text-gray-900">
                  {googleLoading ? "Connecting..." : "Continue with Google"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
