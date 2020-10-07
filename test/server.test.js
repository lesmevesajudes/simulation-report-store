import request from 'supertest';
import app from '../src/server';

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;

function fake_uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

const simulationReportValidBody = {
  'application_state': {state: 1},
  'simulation_id': 'c9ae621e-4b98-4bc9-98c9-098c84ee189e',
  'expected_result': 'Should give benefit 33',
  'accepted_result': false,
  'comments': 'As income is lower than XXX benefit 33 should be given',
  'reporter_email': 'john@doe.com',
  'test_group': 'council'
};
const simulationValidBody = ()=> ({
  'simulation': {state: 1, result: 'test result', data: 'test data'},
  'outcome': 'success',
  'id': fake_uuid(),
});
const simulationError = ()=> ({
  'simulation': {state: 1, result: 'error', data: ''},
  'outcome': 'simulation_error',
  'id': fake_uuid(),
});
const {simulation_id:is_ignored, ...simulationReportInvalidBody} = simulationReportValidBody;
const {id:also_ignored, simulation:ignored_as_well, ...simulationInvalidBody} = simulationValidBody();
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
    const response = await request(app).post('/api/simulation_reports').send(simulationReportValidBody)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });

  it('should not save incomplete simulation reports', async () => {
    const response = await request(app).post('/api/simulation_reports').send(simulationReportInvalidBody)
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
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
  });
});

describe('POST /api/simulations', () => {
  it('should save a simulation', async () => {
    const response = await request(app).post('/api/simulations').send(simulationValidBody())
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });

  it('should save a simulation error', async () => {
    const response = await request(app).post('/api/simulations').send(simulationError())
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });

  it('should not save incomplete simulations', async () => {
    const response = await request(app).post('/api/simulations').send(simulationInvalidBody)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
  });
});

describe('GET /api/simulations', () => {
  it('should get all simulations', async () => {
    const response = await request(app).get('/api/simulations')
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
    const response = await request(app).get('/api/simulations')
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
    const response = await request(app).get('/api/simulations')
        .query({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_BAD_REQUEST);
  });
});
