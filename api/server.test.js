

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
})
const request = require('supertest');
const app = require('../index'); // Assuming your Express app is exported from 'app.js' or similar.

describe('Authentication Endpoints', () => {
  // Define a test user object with username and password for registration and login tests.
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
  };

  // Test for the /register endpoint.
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(testUser.username);
      expect(response.body).toHaveProperty('password');
    });

    it('should return an error if username or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: '', password: '' }); // Sending empty fields

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'username and password required' });
    });

    // Add a test for "username taken" scenario if needed.
  });

  // Test for the /login endpoint.
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(`welcome, ${testUser.username}`);
      expect(response.body).toHaveProperty('token');
    });

    it('should return an error if username or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: '', password: '' }); // Sending empty fields

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'username and password required' });
    });

    it('should return an error if username or password is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'incorrectUser', password: 'incorrectPassword' }); // Incorrect credentials

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'invalid credentials' });
    });
  });
});

