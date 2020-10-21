import request from 'supertest';
import app from '../src/server';

export const HTTP_OK = 200;
export const HTTP_BAD_REQUEST = 400;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_NOT_FOUND = 404;

export const fake_uuid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const validToken = '121331313113';
export const invalidToken = 'invalid-token';

describe('GET /', () => {
  it('should return HTTP_OK on existent path', async () => {
    await request(app).get('/').expect(HTTP_OK);
  });
  it('should return HTTP_NOT_FOUND on inexistent path', async () => {
    await request(app).get('/inexistent').expect(HTTP_NOT_FOUND);
  });
});
