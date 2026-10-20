import React from "react";
import { useDailyProgress } from "@/context/DailyProgress";
import api from "../service/api";
import MealModal from "../components/modals/AddMealModal";
import WaterModal from "../components/modals/AddWaterModal";
import ExerciseModal from "../components/modals/AddExcersiceModal";
import MealSection from "../components/cards/MealSection";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { Flame, Droplets, Dumbbell, Plus, SportShoe, Footprints, Bike, Waves, Icon } from "lucide-react-native";
import { Exercise } from "@/types/types";
import { useState, useEffect } from "react";

export default function DiaryRegister() {
  const { dailyProgress } = useDailyProgress();
  const router = useRouter()
  const [meals, setMeals] = useState<any[]>([]);
  const [goals, setGoals] = useState<any>(null);
  const [activeModal, setActiveModal] = useState< "meal" | "water" | "exercise" | null>(null);//modal to add meals
  const [waterEntries, setWaterEntries] = useState<any[]>([]);
  const [selectedMealType, setSelectedMealType] = useState("");// meal type
  const [selectedMeal, setSelectedMeal] = useState<any>(null);//to get to meal detail
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleDeleteMeal = async (id:number) => {
    try {
      const token = AsyncStorage.getItem("token");

      await api.delete(`/meals/${id}`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      fetchMeals();

    } catch(error) {
      console.log(error);
    }
  };

  const fetchWater = async () => {
      try {
        const token = AsyncStorage.getItem("token");
        const res = await api.get("/water/today",
          {
            headers: { Authorization: `Bearer ${token}`,},
          }
        );
        setWaterEntries(
          Array.isArray(res.data)
          ? res.data
          : []
        );

    } catch (error) {
    console.error(error);
    }
    };

  const fetchMeals = async () => {
    try {
      const token = AsyncStorage.getItem("token");

      const res = await api.get("/meals/today",
        {
          params: { utcOffsetMinutes: new Date().getTimezoneOffset() },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMeals(
        Array.isArray(res.data.meals)
          ? res.data.meals
          : []
      );

    } catch (error) {
      console.error(error);
    }
  };

  const fetchGoals = async () => {
      try {

      const token =
        AsyncStorage.getItem("token");

      const res = await api.get(
        "/goals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGoals(res.data);

      } catch (error) {

      console.error(error);

      }

  };

  const fetchExercises = async () => {
    try {
      const token = AsyncStorage.getItem("token");

      const res = await api.get("/exercises/today",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    console.log(res.data);

    setExercises(
      Array.isArray(res.data.exercises)
        ? res.data.exercises
        : []
    );

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
      fetchMeals();
      fetchGoals();
      fetchWater();
      fetchExercises();
    }, [dailyProgress]);

  // meals
  const breakfastMeals = meals.filter(
      (meal) => meal.mealType === "breakfast"
    );

  const lunchMeals = meals.filter(
      (meal) => meal.mealType === "lunch"
    );

  const dinnerMeals = meals.filter(
      (meal) => meal.mealType === "dinner"
    );

  const snackMeals = meals.filter(
      (meal) => meal.mealType === "snack"
    );

  const consumedCalories = meals.reduce((total, meal) => total + meal.calories, 0);
  const burnedCalories = 0;
  const dailyGoal = goals?.dailyCalories || 0;
  const remainingCalories = dailyGoal - consumedCalories + burnedCalories;
  const totalWater = waterEntries.reduce((total, entry) => total + entry.amount, 0);

  const getExerciseIcon = (name: string) => {
    const exercise = name.toLowerCase();

    if (exercise.includes("run"))
      return <SportShoe size={28} color="#111827" />;

    if (exercise.includes("walk"))
      return <Footprints size={28} color="#111827" />;

    if (exercise.includes("bike"))
      return <Bike size={28} color="#111827" />;

    if (exercise.includes("swim"))
      return <Waves size={28} color="#111827" />;

    return <Dumbbell size={28} color="#111827" />;
  };

  console.log(exercises);

  return (
   <ImageBackground source={require("../../assets/images/public/bg-organic-blue.png")} resizeMode="cover" className="flex-1 bg-[#DDEAF4]"><ScrollView
      className="flex-1" bounces={false} overScrollMode="never" showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
    >

      {/* Header */}
      <View className="mt-2 mb-6">
        <Text style={{ fontFamily: "Chillax-Regular" }} className="mb-1 text-sm text-zinc-600">TODAY'S REGISTER</Text>
        <Text style={{ fontFamily: "Chillax-Bold" }} className="text-3xl text-gray-900 font-chillax-bold">Your diary</Text>
      </View>

      {/* Calories Hero */}
      <View className="relative overflow-hidden rounded-[32px] p-6 mb-6">
        <LinearGradient
          colors={["rgba(227, 170, 136, 0.75)", "rgba(242, 242, 242, 0.75)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 3 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Círculo decorativo en el fondo */}
        <View className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-white/10"/>
          <View className="relative z-10">

            <Text style={{ fontFamily: "Chillax-Regular" }} className="mb-2 text-sm text-zinc-700"> kcal left </Text>
            <Text style={{ fontFamily: "Chillax-Bold" }} className="text-5xl text-gray-900 font-chillax-bold"> {remainingCalories} </Text>

            <View className="flex-row flex-wrap items-center gap-3 mt-5">

              <View className="flex-row items-center gap-1">
                <Flame size={16} color="#111827"/>
                <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-gray-900">{consumedCalories} consumed</Text>
              </View>

              <Text>•</Text>

              <View className="flex-row items-center gap-1">
                <Dumbbell size={16} color="#111827"/>
                <Text style={{ fontFamily: "Chillax-Regular" }} className="text-sm text-gray-900">{burnedCalories} burned</Text>
              </View>

            </View>
          </View>
      </View>

      {/* Quick Actions */}
      <View className="mb-8">
        <View style={{ flexDirection: "row", columnGap: 8 }}>
          {/* Water Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveModal("water")}
            style={{ flex: 1, minWidth: 0 }} className="items-center px-2 py-4 border rounded-3xl bg-[#F2F2F2]/80 border-white/60"
          >

            <View className="flex items-center justify-center w-10 h-10 mb-3 rounded-2xl bg-[#98BDED]/60">

              <Droplets
                size={20}
                color="#4769A8"
              />

            </View>

            <Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-center text-zinc-600">{totalWater} ml</Text>

            <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-2 text-xs text-center text-gray-900">+ Add</Text>

          </TouchableOpacity>

          {/* Comida Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedMealType("");
              setActiveModal("meal");
            }}
            style={{ flex: 1, minWidth: 0 }} className="items-center px-2 py-4 border rounded-3xl bg-[#F2F2F2]/80 border-white/60"
          >

            <View className="flex items-center justify-center w-10 h-10 mb-3 rounded-2xl bg-[#E3AA88]/60">
              <Plus
                size={20}
                color="#111827"
              />
            </View>

            <Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-center text-zinc-600">Meal</Text>
            <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-2 text-xs text-center text-gray-900">+ Add</Text>

          </TouchableOpacity>

          {/* Ejercicio Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveModal("exercise")}
            style={{ flex: 1, minWidth: 0 }} className="items-center px-2 py-4 border rounded-3xl bg-[#F2F2F2]/80 border-white/60"
          >

            <View className="flex items-center justify-center w-10 h-10 mb-3 rounded-2xl bg-[#D9738E]/40">
              <Dumbbell
                size={20}
                color="#111827"
              />
            </View>

            <Text style={{ fontFamily: "Chillax-Regular" }} className="text-xs text-center text-zinc-600">Exercise</Text>

            <Text style={{ fontFamily: "Chillax-Bold" }} className="mt-2 text-xs text-center text-gray-900">+ Add</Text>

          </TouchableOpacity>
        </View>
      </View>

      {/* Comidas */}
      <View className="mb-6 space-y-4">
        <View className="flex items-start justify-between mb-4">
          <Text style={{ fontFamily: "Chillax-Bold" }} className="text-2xl text-gray-900 font-chillax-bold"> Meals </Text>
        </View>

        <MealSection
          title="Breakfast"
          meals={breakfastMeals}
          mealType="breakfast"
          onRepeated={fetchMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("breakfast");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Lunch"
          meals={lunchMeals}
          mealType="lunch"
          onRepeated={fetchMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("lunch");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Dinner"
          meals={dinnerMeals}
          mealType="dinner"
          onRepeated={fetchMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("dinner");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Snack"
          meals={snackMeals}
          mealType="snack"
          onRepeated={fetchMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("snack");
            setActiveModal("meal");
          }}
        />

      </View>

      {/* Exercises */}
      <View style={{ padding: 20, borderRadius: 28, backgroundColor: "rgba(242,242,242,0.9)", borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" }}>
        <Text style={{ fontFamily: "Chillax-Semibold", fontSize: 20, lineHeight: 28, color: "#111827", marginBottom: 12 }}>Exercises</Text>
        {exercises.length === 0 ? (
          <Text style={{ fontFamily: "Chillax-Regular", fontSize: 14, lineHeight: 22, color: "#52525B" }}>No exercises added yet</Text>
        ) : (
          <View>
            {exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/exercise/${exercise.id}` as any)}
                style={{ flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, borderRadius: 18, backgroundColor: "rgba(217,115,142,0.12)" }}
              >
                <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(217,115,142,0.2)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  {getExerciseIcon(exercise.name)}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Chillax-Medium", fontSize: 14, lineHeight: 21, color: "#111827" }}>{exercise.name}</Text>
                  <Text style={{ fontFamily: "Chillax-Regular", fontSize: 12, lineHeight: 19, color: "#52525B" }}>{exercise.duration} min · {exercise.caloriesBurned} kcal</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() => setActiveModal("exercise")}
          activeOpacity={0.7}
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12, paddingVertical: 12, borderRadius: 16, backgroundColor: "rgba(217,115,142,0.2)" }}
        >
          <Plus size={18} color="#8A3D53" />
          <Text style={{ fontFamily: "Chillax-Medium", fontSize: 14, lineHeight: 20, color: "#8A3D53", marginLeft: 8 }}>Add exercise</Text>
        </TouchableOpacity>
      </View>

      {/* AI Insight */}
      <View className="p-5 mt-8 rounded-3xl bg-[#E3AA88]/70">
        <Text style={{ fontFamily: "Chillax-Regular" }} className="mb-2 text-sm text-zinc-800"> ONE STEP AT A TIME </Text>

        <Text style={{ fontFamily: "Chillax-Semibold" }} className="text-lg leading-relaxed text-gray-900 font-chillax-semibold">Every entry counts</Text>

        <Text style={{ fontFamily: "Chillax-Regular" }} className="mt-2 text-sm text-zinc-800">Log your meals, water and movement to support your goals.</Text>
      </View>

      {activeModal === "meal" && (
      <MealModal
        mealType={selectedMealType}
        onClose={() => setActiveModal(null)}
        onSuccess={() => {
          fetchMeals();
          setActiveModal(null);
        }}
      />
      )}


      { activeModal === "water" && (
        <WaterModal
          onClose={() => setActiveModal(null)}
          onWaterAdded={fetchWater}
        />
      )}

      { activeModal === "exercise" && (
        <ExerciseModal
          onClose={() => setActiveModal(null)}
          onExerciseAdded={fetchExercises}
        />
      )}

    </ScrollView></ImageBackground>
  );
}
