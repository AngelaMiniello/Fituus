import { useState } from "react";
import api from "../../service/api";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mail, Eye, EyeOff } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useAuth();
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

  return (
    <View style={{ flex: 1, width: "100%", height: "100%"}}>

      <Image
        source={require("@/assets/images/public/bgreg1.png")}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%", resizeMode: "cover" }
        ]}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, }} showsVerticalScrollIndicator={false}>

        {/* Brand Header */}
        <View className="mt-4 mb-8">
          <Text className="font-bold text-gray-900 text-md font-chillax">fituus</Text>
        </View>

        {/*Form Wrapper */}
        <View className="my-auto">
          <View className="items-center w-full mb-8">
            <Text className="mb-4 text-3xl font-bold leading-tight tracking-wide text-gray-900 font-chillax">Login</Text>
          </View>

          <View className="w-full p-4 border rounded-3xl bg-pink-300/60 border-white/20">  
            <View className="flex-col gap-3">
              <View>
                <View className="relative items-center justify-center mb-4">
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
                <View className="relative items-center justify-center mb-4">
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
                className="self-stretch py-4 mt-2 items-center justify-center rounded-full bg-[#7999D9]"
              >
                <Text className="text-base font-semibold text-white">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}