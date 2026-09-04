import { useState } from "react";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, User, AtSign, Mail, Lock, UserCircle2, ChevronRight } from "lucide-react-native";
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, TextInput} from "react-native";

import { registerSchema } from "../lib/registerSchema";
import { register } from "../service/authService";
import { IRegisterProps } from "../types/types";
import { useAuth } from "../context/AuthContext";

export default function RegisterView() {
  const router = useRouter();
  const { setUserData } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const handleSubmit = async (values: IRegisterProps) => {
  try {
    const response = await register(values);

    if (response?.token) {
      // NO llamamos a setUserData acá para no disparar el redireccionamiento del layout
      router.push({
        pathname: "/register/profile",
        params: { token: response.token },
      } as any);
    }
  } catch (error) {
    console.error("Error en registro:", error);
  }
};
  
  return (
    <ImageBackground
      source={require("../../assets/images/public/bg.png")}
      className="flex-1 bg-black"
      resizeMode="cover"
    >

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 40,
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* Title Header */}
        <View className="items-center w-full mb-8">
          <Text className="text-2xl font-bold tracking-wide text-center text-gray-900">
            PERSONAL INFORMATION
          </Text>
        </View>
     
        {/* Card Form Wrapper */}
        <View className="w-full p-4 border rounded-3xl bg-pink-300/60 border-white/20">        
          <Formik
            onSubmit={handleSubmit}
            initialValues={{
              name: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={registerSchema}
          >

          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View className="flex-col gap-4">

              {/* Name field */}
              <View>
                <View className="relative justify-center">
                  <TextInput
                    value={values.name}
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="Name"
                    placeholderTextColor="#71717a"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                  />
                    <View className="absolute pointer-events-none right-4">
                      <User size={20} color="#71717a" />
                    </View>
                </View>
                {touched.name && errors.name && (
                  <Text className="mt-1 ml-2 text-sm text-red-400">
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Username field */}
              <View>
                <View className="relative justify-center">
                  <TextInput
                    value={values.username}
                    onChangeText={handleChange("username")}
                    onBlur={handleBlur("username")}
                    placeholder="Username"
                    placeholderTextColor="#71717a"
                    autoCapitalize="none"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                  />
                  <View className="absolute pointer-events-none right-4">
                    <AtSign size={20} color="#71717a" />
                  </View>
                </View>
                {touched.username && errors.username && (
                  <Text className="mt-1 ml-2 text-sm text-red-400">
                    {errors.username}
                  </Text>
                )}
              </View>

              {/* Email field */}
              <View>
                <View className="relative justify-center">
                  <TextInput
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Email"
                    placeholderTextColor="#71717a"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                  />
                    <View className="absolute pointer-events-none right-4">
                      <Mail size={20} color="#71717a" />
                    </View>
                </View>
                {touched.email && errors.email && (
                  <Text className="mt-1 ml-2 text-sm text-red-400">
                    {errors.email}
                  </Text>
                )}
              </View>

              {/* Password field */}
              <View>
                <View className="relative justify-center">
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Password"
                    placeholderTextColor="#71717a"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
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
                  {touched.password && errors.password && (
                    <Text className="mt-1 ml-2 text-sm text-red-400">
                      {errors.password}
                    </Text>
                  )}
              </View>

              {/* Confirm password field */}
              <View>
                <View className="relative justify-center">
                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    placeholder="Confirm Password"
                    placeholderTextColor="#71717a"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    className="w-full p-4 pr-12 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
                  />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute p-1 right-4"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} color="#71717a" />
                      ) : (
                        <Eye size={20} color="#71717a" />
                      )}
                    </TouchableOpacity>
                </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text className="mt-1 ml-2 text-sm text-red-400">
                      {errors.confirmPassword}
                    </Text>
                  )}
              </View>

              {/*submit and continue */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSubmit()}
                className="self-stretch py-4 mt-2 items-center justify-center rounded-full bg-[#7999D9]"
              >
                <Text className="text-base font-semibold text-white">
                  Continue
                </Text>
              </TouchableOpacity>

            </View>
          )}
          </Formik>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}