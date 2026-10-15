import { Beef, Cuboid, Droplets, Dumbbell, Flame, Footprints, Moon, Wheat } from "lucide-react-native";

export const goalFields = [
  { field: "dailyCalories", label: "Calories", unit: "kcal / day", icon: Flame, color: "#E3AA88", max: 20000, integer: true },
  { field: "proteinGoal", label: "Protein", unit: "g / day", icon: Beef, color: "#D9738E", max: 2000, integer: true },
  { field: "carbsGoal", label: "Carbs", unit: "g / day", icon: Wheat, color: "#98BDED", max: 5000, integer: true },
  { field: "fatGoal", label: "Fats", unit: "g / day", icon: Cuboid, color: "#E3AA88", max: 2000, integer: true },
  { field: "waterGoal", label: "Water", unit: "ml / day", icon: Droplets, color: "#98BDED", max: 20000, integer: true },
  { field: "stepsGoal", label: "Steps", unit: "steps / day", icon: Footprints, color: "#7797D9", max: 200000, integer: true },
  { field: "workoutsPerWeek", label: "Workouts", unit: "days / week", icon: Dumbbell, color: "#D9738E", max: 7, integer: true },
  { field: "sleepGoal", label: "Sleep", unit: "hours / night", icon: Moon, color: "#98BDED", max: 24, integer: false },
] as const;
export type GoalField = typeof goalFields[number];
