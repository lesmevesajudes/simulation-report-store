import request from 'supertest';
import app from "../src/server";

const HTTP_OK=200;
const HTTP_BAD_REQUEST=400;
const HTTP_UNAUTHORIZED=401;
const HTTP_NOT_FOUND=404;

const validBody = {
  'application_state': '{"state": 1}',
  'simulation_id': 'c9ae621e-4b98-4bc9-98c9-098c84ee189e',
  'expected_result': 'Should give benefit 33',
  'accepted_result': false,
  'comments': 'As income is lower than XXX benefit 33 should be given',
  'tester_email': 'john@doe.com',
  'test_group': 'council'
};
const {simulation_id, ...invalidBody} = validBody;
const validToken = '121331313113';
const invalidToken = 'invalid-token';

describe('GET /', () => {
  it('should return HTTP_OK on existent path', async () => {
    await request(app).get('/').expect(HTTP_OK);
  });
  it('should return HTTP_NOT_FOUND on inexistent path', async () => {
    await request(app).get('/inexistent').expect(HTTP_NOT_FOUND);
  });
});

describe('POST /api/simulation_reports', () => {
  it('should save a simulation report', async () => {
    const response = await request(app).post('/api/simulation_reports').send(validBody)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });

  it('should not save incomplete simulation reports', async () => {
    const response = await request(app).post('/api/simulation_reports').send(invalidBody)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
  });
});

describe('GET /api/simulation_reports', () => {
  it('should get all simulation reports', async () => {
    const response = await request(app).get('/api/simulation_reports')
        .query(
            {
              filter: {},
              range: '[0, 9]',
              sort: '[id, DESC]'
            })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });
  it('should require a valid token', async () => {
    const response = await request(app).get('/api/simulation_reports')
        .query(
            {
              filter: {},
              range: '[0, 9]',
              sort: '[id, DESC]'
            })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', invalidToken);
    expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
  });
  it('should include query parameters', async () => {
    const response = await request(app).get('/api/simulation_reports')
        .query(
            {
            })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
  });
});
