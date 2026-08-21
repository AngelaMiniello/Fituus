export function buildWeeklyPrompt(

  data: {
    protein: number;
    water: number;
    calories: number;
  }

) {

  return `
    Eres un coach fitness.

    Proteína: ${data.protein}
    Agua: ${data.water}
    Calorías: ${data.calories}

    Genera un insight breve.
    `;
}