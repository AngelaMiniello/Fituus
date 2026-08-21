import { useEffect, useState } from "react";
import api from "../service/api";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";

export default function ExerciseDetailView(){

    const params = useLocalSearchParams ();
    const { id } = useLocalSearchParams ();
    const router = useRouter();
    const [exercise, setExercise] = useState<any>(null);
    const [duration, setDuration] = useState<number | string>("");

    useEffect(() => {//cuando monto la pag
      const fetchExercises = async () => {//voy a buscar los ejercicios
        try {//le digo proba 
            const token = localStorage.getItem("token");//q el usuer este logeado 

            const res = await api.get(`/exercises/${id}`,
              {
                headers:{
                  Authorization:`Bearer ${token}`
                }
            })

            setExercise(res.data);
            setDuration(res.data.duration);

        } catch (error) {
          console.log(error);
        }
      }

      fetchExercises();

    }, []);

    const handleUpdateExercise = async () => {
        try {
          const token = localStorage.getItem("token");

          const res = api.put(`/exercises/${id}`,
            {
              duration
            },
            {
              headers: {
                Authorization:`Bearer ${token}`
              }
            }
          );

          router.push("/diary");
        } catch(error) {
          console.log(error);
        }
    }

    //recalcular visualmente , duration (string del input), durationNumber (número), calcular calorías usando durationNumber
    const durationNumber = Number(duration) || 0;

    const calories = ((exercise?.baseCaloriesBurned ?? 0) * durationNumber) / (exercise?.baseDuration ?? 1);
    
    if (!exercise) {
      return (
    <ScrollView className="flex items-center justify-center min-h-screen text-white bg-zinc-950">
      Loading...
    </ScrollView>
  );
}

  return (
    <ScrollView 
      className="flex-1 bg-zinc-950" 
      contentContainerStyle={{ flexGrow: 1, padding: 24 }}
    >
      <Text className="mb-6 text-3xl font-bold text-white">{exercise.name}</Text>
 
      <View className="flex-col gap-4">
        <View className="p-4 rounded-2xl bg-zinc-900">
          <Text className="text-zinc-400">
            Burned calories: <Text className="font-bold text-white">{Math.round(calories)} kcal</Text>
          </Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="mt-4 ml-2 text-sm text-zinc-400">Duration:</Text>
          <TextInput
            keyboardType="numeric"
            value={duration.toString()}
            onChangeText={(text) => {
              setDuration(text === "" ? "" : Number(text));
            }}
            placeholder="0"
            placeholderTextColor="#71717a" // color zinc-500 para el placeholder
            className="w-full p-4 mt-2 text-white border rounded-2xl bg-zinc-900 border-zinc-800"
          />
      </View>

     <View className="flex-col items-center mb-6">
        {/* Botón Principal (Save Changes) */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleUpdateExercise}
          className="w-full py-4 mt-4 items-center justify-center rounded-2xl bg-[#7999D9]"
        >
          <Text className="font-medium text-white">Save changes</Text>
        </TouchableOpacity>

        {/* Botón Secundario / Volver (Diary) */}
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={() => router.push("/diary")}
          className="flex-row items-center gap-2 mt-4"
        >
          <ArrowLeft size={16} color="#a1a1aa" />
          <Text className="text-zinc-400">Diary</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}