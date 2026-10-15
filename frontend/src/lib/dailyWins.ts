export function dailyWins(meals: number, water: number, waterGoal: number | null) {
  const waterEnabled = waterGoal !== null && Number.isFinite(waterGoal) && waterGoal > 0;
  return [
    { id: "check-in", title: "Daily Check-in", description: "Show up for yourself. Open fituus today.", value: 1, target: 1, complete: true, progress: 1, detail: "You showed up today", color: "#E3AA88", tint: "#FAE8DC" },
    { id: "food", title: "First Bite", description: "Log your first meal of the day.", value: meals, target: 1, complete: meals >= 1, progress: Math.min(1, Math.max(0, meals)), detail: `${Math.min(meals, 1)} / 1 meal logged`, color: "#D9738E", tint: "#F9E2E9" },
    { id: "water", title: "Hydration Hero", description: "Reach your personal water goal today.", value: water, target: waterGoal, complete: waterEnabled && water >= waterGoal!, progress: waterEnabled ? Math.max(0, Math.min(1, water / waterGoal!)) : 0, detail: waterEnabled ? `${water.toLocaleString("en-US")} / ${waterGoal!.toLocaleString("en-US")} ml` : "Set a water goal in Settings", color: "#7797D9", tint: "#BDD1EF" },
  ];
}
