import React from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Flame, Droplets, Dumbbell, Plus, SportShoe, Footprints, Bike, Waves, Icon } from "lucide-react-native";
import { Exercise } from "@/types/types";

import { useState, useEffect } from "react";

import api from "../service/api";
import MealModal from "../components/modals/AddMealModal";
import WaterModal from "../components/modals/AddWaterModal";
import ExerciseModal from "../components/modals/AddExcersiceModal";
import MealSection from "../components/cards/MealSection";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DiaryRegister() {
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
    }, []);
  
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
      return <SportShoe size={28} />;

    if (exercise.includes("walk"))
      return <Footprints size={28} />;

    if (exercise.includes("bike"))
      return <Bike size={28} />;

    if (exercise.includes("swim"))
      return <Waves size={28} />;

    return <Dumbbell size={28} />;
  };

  console.log(exercises);

  return (
   <ScrollView 
      className="flex-1 px-4 py-6 bg-zinc-950"
      contentContainerStyle={{ paddingBottom: 100 }}
    >

      {/* Header */}
      <View className="mb-8">
        <Text className="mb-1 text-sm text-zinc-400"> Today </Text>
        <Text className="text-3xl font-bold text-white">  Daily register </Text>
      </View>

      {/* Calories Hero */}
      <View className="relative overflow-hidden rounded-[32px] p-6 mb-6">
        <LinearGradient
          colors={["#7999D9", "#A0CCF2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        
        {/* Círculo decorativo en el fondo */}
        <View className="absolute w-40 h-40 rounded-full -top-10 -right-10 bg-white/10"/>

          <View className="relative z-10">
            
            <Text className="mb-2 text-sm text-white/80"> Calories left </Text>
            <Text className="text-5xl font-bold text-white"> {remainingCalories} </Text>

            <View className="flex items-center gap-3 mt-5 text-sm text-white/90">

              <View className="flex items-center gap-1">
                <Flame size={16} color="#ffffff"/>
                {consumedCalories} consumed
              </View>

              <Text>•</Text>

              <View className="flex items-center gap-1">
                <Dumbbell size={16} color="#ffffff"/>
                {burnedCalories} burned
              </View>

            </View>
          </View>
      </View>

      {/* Quick Actions */}
      <View className="mb-8">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex gap-3">
          {/* Water Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveModal("water")}
            className="w-[115px] rounded-3xl p-4 bg-zinc-900 border border-zinc-800 mr-3"
          >

            <View className="flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-[#7999D9]/20">

              <Droplets
                size={20}
                color="#A0CCF2"
              />

            </View>

            <Text className="text-sm text-zinc-400"> {totalWater} ml </Text>

            <Text className="mt-1 font-bold text-white text-md"> + Add </Text>

          </TouchableOpacity>

          {/* Meal Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setSelectedMealType("");
              setActiveModal("meal");
            }}
            className="w-[115px] rounded-3xl p-4 bg-zinc-900 border border-zinc-800 mr-3"
          >

            <View className="flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-orange-500/20">
              <Plus
                size={20}
                color="#fdba74"
              />
            </View>

            <Text className="text-sm text-zinc-400"> Meal </Text>
            <Text className="mt-1 font-bold text-white text-md"> + Add </Text>

          </TouchableOpacity>

          {/* Exercise Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveModal("exercise")}
            className="w-[115px] rounded-3xl p-4 bg-zinc-900 border border-zinc-800 mr-3"
          >

            <View className="flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-green-500/20">
              <Dumbbell
                size={20}
                color="#86efac"
              />
            </View>

            <Text className="text-sm text-zinc-400"> Exercise </Text>

            <Text className="mt-1 font-bold text-white text-md"> + Add </Text>

          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Meals */}
      <View className="mb-6 space-y-4">
        <View className="flex items-center justify-between mb-2">
          <Text className="text-xl font-bold text-white"> Meals </Text>
        </View>

        <MealSection
          title="Breakfast"
          meals={breakfastMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("breakfast");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Lunch"
          meals={lunchMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("lunch");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Dinner"
          meals={dinnerMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("dinner");
            setActiveModal("meal");
          }}
        />

        <MealSection
          title="Snack"
          meals={snackMeals}
          onDelete={handleDeleteMeal}
          onAdd={() => {
            setSelectedMealType("snack");
            setActiveModal("meal");
          }}
        />

      </View>

      {/* Excersices */}
      <View className="space-y-4">
        <View className="mb-2">
          <Text className="mb-4 text-xl font-bold text-white"> Exercises </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 pb-2">              
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  activeOpacity={0.7}
                  className="flex-col items-center min-w-[90px] mr-4"
                  onPress={() => router.push(`/exercise/${exercise.id}` as any)}
                >

                  <View className="flex items-center justify-center w-20 h-20 border rounded-full bg-zinc-900 border-zinc-800 text-[#7999D9] hover:border-[#7999D9] hover:border-1">
                    {getExerciseIcon(exercise.name)}
                  </View>

                  <Text className="mt-2 text-sm font-medium text-white"> {exercise.duration} min </Text>

                  <Text className="text-xs text-zinc-400"> {exercise.caloriesBurned} kcal </Text>

                </TouchableOpacity>
              ))}
            </ScrollView>
        </View>
      </View>

      {/* AI Insight */}
      <View className="p-5 mt-8 border rounded-3xl bg-zinc-900 border-zinc-800">
        <Text className="mb-2 text-sm text-zinc-400"> Insight IA </Text>

        <Text className="text-lg font-semibold leading-relaxed text-white">  More protein intake than yesterday 💪</Text>

        <Text className="mt-2 text-sm text-zinc-500"> Keep going to get closer to your weekly goals </Text>
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
        
    </ScrollView>
  );
}