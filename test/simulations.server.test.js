import request from 'supertest';
import app from '../src/server';
import {HTTP_OK, HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, HTTP_NOT_FOUND} from './server.test';
import {validToken, invalidToken, fake_uuid} from './server.test';

const simulationError = ()=> ({
  'simulation': {state: 1, result: 'error', data: ''},
  'outcome': 'simulation_error',
  'id': fake_uuid(),
});

const simulationValidBody = ()=> ({
  'simulation': {state: 1, result: 'test result', data: 'test data'},
  'outcome': 'success',
  'id': fake_uuid(),
});

const {id:also_ignored, simulation:ignored_as_well, ...simulationInvalidBody} = simulationValidBody();

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
            	page: 1,
            	limit: 50
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
            	page: 1,
            	limit: 50
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