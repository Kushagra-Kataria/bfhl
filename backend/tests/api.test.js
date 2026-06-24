const request = require('supertest');
const app = require('../src/app');

describe('POST /bfhl - Integration Tests', () => {
  test('returns correct response for simple tree', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'A->C', 'B->D'] })
      .expect(200);

    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('email_id');
    expect(res.body).toHaveProperty('college_roll_number');
    expect(res.body.hierarchies).toHaveLength(1);
    expect(res.body.hierarchies[0].root).toBe('A');
    expect(res.body.hierarchies[0].depth).toBe(3);
    expect(res.body.invalid_entries).toHaveLength(0);
    expect(res.body.duplicate_edges).toHaveLength(0);
    expect(res.body.summary.total_trees).toBe(1);
  });

  test('handles invalid entries', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['hello', '1->2', 'A->'] })
      .expect(200);

    expect(res.body.invalid_entries).toEqual(['hello', '1->2', 'A->']);
    expect(res.body.hierarchies).toHaveLength(0);
  });

  test('handles duplicate edges', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'A->B', 'A->B'] })
      .expect(200);

    expect(res.body.duplicate_edges).toEqual(['A->B']);
    expect(res.body.hierarchies).toHaveLength(1);
  });

  test('handles cycle detection', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'B->C', 'C->A'] })
      .expect(200);

    expect(res.body.hierarchies[0].has_cycle).toBe(true);
    expect(res.body.summary.total_cycles).toBe(1);
    expect(res.body.summary.total_trees).toBe(0);
  });

  test('handles mixed valid and invalid entries', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'hello', 'B->C', '1->2'] })
      .expect(200);

    expect(res.body.hierarchies).toHaveLength(1);
    expect(res.body.invalid_entries).toHaveLength(2);
  });

  test('trims whitespace from edges', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: [' A->B ', '  C->D  '] })
      .expect(200);

    expect(res.body.hierarchies).toHaveLength(2);
    expect(res.body.invalid_entries).toHaveLength(0);
  });

  test('returns 400 for missing data field', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({})
      .expect(400);

    expect(res.body.error).toBe('Bad Request');
  });

  test('returns 400 for non-array data', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: 'abc' })
      .expect(400);

    expect(res.body.error).toBe('Bad Request');
  });

  test('handles empty array', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: [] })
      .expect(200);

    expect(res.body.hierarchies).toHaveLength(0);
    expect(res.body.summary.total_trees).toBe(0);
  });

  test('handles diamond pattern (multi-parent)', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'A->C', 'B->D', 'C->D'] })
      .expect(200);

    // D should only have one parent (first wins)
    expect(res.body.hierarchies).toHaveLength(1);
    expect(res.body.hierarchies[0].tree).toEqual({
      A: { B: { D: {} }, C: {} },
    });
  });

  test('handles forest (multiple independent trees)', async () => {
    const res = await request(app)
      .post('/bfhl')
      .send({ data: ['A->B', 'C->D', 'E->F'] })
      .expect(200);

    expect(res.body.hierarchies).toHaveLength(3);
    expect(res.body.summary.total_trees).toBe(3);
  });
});

describe('GET /bfhl', () => {
  test('returns health check', async () => {
    const res = await request(app)
      .get('/bfhl')
      .expect(200);

    expect(res.body).toHaveProperty('operation_code', 1);
  });
});

describe('GET / - Root Health Check', () => {
  test('returns API status', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    expect(res.body.status).toBe('ok');
  });
});
