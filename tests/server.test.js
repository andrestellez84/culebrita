const request = require('supertest');
const fs = require('fs');
const path = require('path');
let app;

beforeAll(() => {
  app = require('../index');
});

afterAll(() => {
  if (app && app.close) app.close();
});

test('GET /scores returns array', async () => {
  const res = await request(app).get('/scores');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /scores adds score', async () => {
  const res = await request(app)
    .post('/scores')
    .send({ name: 'Test', score: 5 });
  expect(res.statusCode).toBe(201);
  const scores = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'scores.json')));
  const found = scores.find(s => s.name === 'Test' && s.score === 5);
  expect(found).toBeTruthy();
});
