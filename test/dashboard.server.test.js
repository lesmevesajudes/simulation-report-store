import request from 'supertest';
import app from '../src/server';
import {HTTP_OK, HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED, HTTP_NOT_FOUND} from './server.test';
import {validToken, invalidToken} from './server.test';

describe('GET /api/dashboard', () => {
  it('get all dashboards', async () => {
    const response = await request(app).get('/api/dashboard')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', validToken);
    expect(response.statusCode).toBe(HTTP_OK);
  });
  it('should require a valid token', async () => {
    const response = await request(app).get('/api/dashboard')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Authentication-Token', invalidToken);
    expect(response.statusCode).toBe(HTTP_UNAUTHORIZED);
  });
});