const { test } = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');
const { AppDataSource } = require('../dist/config/data-source');
const { mealInsights } = require('../dist/meal/meal-insights.controller');

test('meal insights validate consent, ownership, privacy, cache, quotas and upstream failures', async () => {
  const originalRepo = AppDataSource.getRepository;
  const originalPost = axios.post;
  const originalKey = process.env.GEMINI_API_KEY;
  let calls = 0;
  let owned = true;
  let fail = false;
  let refuse = false;
  let quota = false;
  let malformed = false;
  let upstreamStatus;
  let lastWhere;
  const food = { id: 1, name: 'Toast', quantity: 50, calories: 140, protein: 4, carbs: 25, fat: 3,
    user: { email: 'private@example.com', weight: 65 } };
  AppDataSource.getRepository = () => ({ find: async ({ where }) => { lastWhere = where; return owned ? [food] : []; } });
  axios.post = async (url, body, config) => {
    calls++;
    assert.equal(url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent');
    assert.equal(config.headers['x-goog-api-key'], 'test-only-not-a-real-key');
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(body.generationConfig.maxOutputTokens, 400);
    assert.equal(body.contents[0].parts[0].text.includes('private@example.com'), false);
    assert.equal(body.contents[0].parts[0].text.includes('weight'), false);
    assert.equal(JSON.parse(body.contents[0].parts[0].text).foods[0].name, 'Toast');
    if (quota) throw { isAxiosError: true, response: { status: 429 } };
    if (upstreamStatus) throw { isAxiosError: true, response: { status: upstreamStatus } };
    if (malformed) return { data: { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'not JSON' }] } }] } };
    if (fail) throw new Error('upstream unavailable');
    return { data: { candidates: [{ finishReason: refuse ? 'SAFETY' : 'STOP', content: { parts: [{ text: JSON.stringify({ summary: 'This meal includes carbohydrates.', suggestion: 'You could add variety next time.' }) }] } }] } };
  };
  const run = async (body = { mealIds: [1], consent: true, consentVersion: "gemini-demo-v1" }, user = 1) => {
    const res = { code: 200, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
    await mealInsights({ body, user: { id: user } }, res);
    return res;
  };
  try {
    process.env.GEMINI_API_KEY = 'test-only-not-a-real-key';
    assert.equal((await run({ mealIds: [1] })).code, 400);
    assert.equal((await run({ mealIds: [1], consent: true })).code, 400, 'old provider consent must not be reused');
    assert.equal((await run({ mealIds: [1, 1], consent: true })).code, 400);
    delete process.env.GEMINI_API_KEY;
    assert.equal((await run()).code, 503);
    process.env.GEMINI_API_KEY = 'test-only-not-a-real-key';
    owned = false;
    assert.equal((await run()).code, 404);
    assert.equal(calls, 0);
    assert.equal(lastWhere.user.id, 1);
    owned = true;
    assert.equal((await run()).code, 200);
    assert.equal((await run()).code, 200);
    assert.equal(calls, 1, 'repeat request should use cached insight');
    assert.equal((await run(undefined, 2)).code, 200);
    assert.equal(calls, 2, 'cache must be scoped to user');
    fail = true;
    for (let i = 0; i < 10; i++) assert.equal((await run(undefined, 3)).code, 502);
    assert.equal((await run(undefined, 3)).code, 429);
    fail = false;
    refuse = true;
    assert.equal((await run(undefined, 4)).code, 422);
    refuse = false;
    const pair = await Promise.all([run(undefined, 5), run(undefined, 5)]);
    assert.deepEqual(pair.map(r => r.code).sort(), [200, 429]);
    quota = true;
    const limited = await run(undefined, 6);
    assert.equal(limited.code, 429);
    assert.match(limited.data.message, /AI service/);
    quota = false;
    malformed = true;
    assert.equal((await run(undefined, 7)).code, 502);
    malformed = false;
    for (const status of [400, 401, 403, 404]) {
      upstreamStatus = status;
      assert.equal((await run(undefined, status)).code, 503);
    }
  } finally {
    AppDataSource.getRepository = originalRepo;
    axios.post = originalPost;
    if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = originalKey;
  }
});
