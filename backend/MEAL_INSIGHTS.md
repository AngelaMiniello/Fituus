# Meal insights (MVP)

The Diary shows an optional **Meal insights** button for each populated meal section.
The user confirms sharing food names, quantities and logged nutrients with Google Gemini.
No profile, email, weight or user identifier is sent to the model. The free tier may use inputs and outputs to improve Google products, including
human review. This MVP is labeled for fictitious demo entries only; do not submit
personal or sensitive data. The UI requires fresh Google-specific consent.

## Enable

Set these environment variables in **the backend** locally or in Render:

```dotenv
GEMINI_API_KEY=your-server-side-api-key
GEMINI_MEAL_MODEL=gemini-2.5-flash-lite
```

Never add the key to the frontend or an `EXPO_PUBLIC_` variable. The model setting
is optional. Create a key at https://aistudio.google.com/api-keys and select a project on the
Free tier. Do not enable billing if you want to stay on the free quota. Free-tier
availability and limits depend on model, project and region; this code cannot
enforce the billing tier of your Google project. It never falls back to a paid
provider or model. A provider 429 shows a retry-later message.
Push the changes and deploy the backend, then reload the updated frontend.
The old frontend consent will be rejected. Remove obsolete OPENAI_API_KEY and
OPENAI_MEAL_MODEL from Render if they were configured for this feature. No database migration is needed.
Without a key the endpoint returns a friendly 503, never a simulated AI response.

## Behavior and limits

`POST /meals/insights` requires authentication and `{ mealIds: [1, 2], consent: true, consentVersion: "gemini-demo-v1" }`.
Only rows belonging to the authenticated user are read. Accepts 1–30 unique IDs.
Returns `{ summary, suggestion }` in English, with optional general guidance.
Missing nutrients are unknown. Instructions exclude food ratings, weight loss,
restriction, medical advice and assumptions about allergies. AI output can still
be inaccurate and the UI labels it accordingly.

The initial single-instance implementation caches identical meal snapshots by user,
limits each user to 10 uncached attempts per UTC day, and caps the process at 100
uncached attempts per UTC day. Concurrent requests from one user are blocked.
Failed provider attempts also count. Limits and cache live in memory and reset
on restart; they are **not a hard spending cap across replicas or restarts**.
Use provider project limits/alerts and replace with shared persistent counters
before scaling. The frontend invalidates displayed insights when foods change.

## Verification

```sh
npm run build
node --test tests/meal-insights.test.cjs
```

Tests mock the provider and database; they do not spend API credits or send food data.
Manually test consent cancel/continue, loading, retries, adding/editing/deleting a
food, and a real request after configuring backend credentials.

References: https://ai.google.dev/api/generate-content
and https://ai.google.dev/gemini-api/docs/pricing
and https://ai.google.dev/gemini-api/terms
