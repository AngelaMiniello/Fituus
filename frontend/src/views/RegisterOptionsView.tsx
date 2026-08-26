import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

export default function RegisterOptionsView() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
      console.log("Google Login");
    };

    const handleRegister = () => {
      router.push("/register/signup");
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
                onPress={() => {
                  /* Lógica de Google Sign-In */
                }}
              >
                <Text className="text-lg font-medium text-white"> Continue with Google </Text>
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